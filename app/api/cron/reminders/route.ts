
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { sendLiveClassReminder } from "@/lib/mail";
import { addHours, startOfMinute, endOfMinute } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        // Find classes starting in exactly 1 hour (with 5 min buffer for cron drift)
        const now = new Date();
        const oneHourFromNow = addHours(now, 1);

        // Window: [Scenario] Class starts at 10:00. Cron runs at 09:00.
        // We look for classes scheduled between 09:55 and 10:05? 
        // Better: look for classes starting in the next hour that haven't had reminders sent.

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

        if (upcomingClasses.length === 0) {
            return NextResponse.json({ message: "No upcoming classes found for reminders." });
        }

        const results = [];

        for (const liveClass of upcomingClasses) {
            const students = liveClass.course.enrollments.map((e) => e.user);

            // Send emails in parallel
            const emailPromises = students.map((student) =>
                sendLiveClassReminder(
                    student.email,
                    student.name,
                    liveClass.title,
                    liveClass.scheduledAt.toLocaleString(),
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
                classId: liveClass.id,
                title: liveClass.title,
                sentTo: students.length,
            });
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            details: results
        });

    } catch (error: any) {
        console.error("[CRON_ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
