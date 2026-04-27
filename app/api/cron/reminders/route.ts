
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { sendLiveClassReminder } from "@/lib/mail";
import { addHours, format } from "date-fns";

export const dynamic = "force-dynamic";

/**
 * Unified Cron Route for System Reminders
 * Handles:
 * 1. Live Class Reminders (1 hour before start)
 */
export async function GET(req: Request) {
    try {
        // 1. Security Check
        const authHeader = req.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        const now = new Date();
        const oneHourFromNow = addHours(now, 1.1); // 1 hour + 6 min buffer

        // --- Task A: Live Class Reminders ---
        const upcomingClasses = await prisma.liveClass.findMany({
            where: {
                scheduledAt: {
                    gte: now,
                    lte: oneHourFromNow,
                },
                reminderSent: false,
            },
            include: {
                course: {
                    include: {
                        enrollments: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        console.log(`[CRON] Processing ${upcomingClasses.length} live class reminders.`);

        const results = [];

        for (const liveClass of upcomingClasses) {
            const enrollments = (liveClass as any).course.enrollments;
            const students = enrollments.map((e: any) => e.user).filter((u: any) => u.email);

            // Send emails
            const emailPromises = students.map((student: any) =>
                sendLiveClassReminder(
                    student.email,
                    student.name || 'Student',
                    liveClass.title,
                    format(liveClass.scheduledAt, 'PPP p'),
                    liveClass.meetingUrl
                )
            );

            await Promise.all(emailPromises);

            // Mark as sent
            await prisma.liveClass.update({
                where: { id: liveClass.id },
                data: { reminderSent: true },
            });

            results.push({
                type: 'LIVE_CLASS_REMINDER',
                classId: liveClass.id,
                sentTo: students.length,
            });
        }

        // --- Future Tasks (Assignments, Exams) can be added here ---

        return NextResponse.json({
            success: true,
            timestamp: now.toISOString(),
            processed: results.length,
            details: results
        });

    } catch (error: any) {
        console.error("[CRON_ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
