
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sendLiveClassReminder } from '@/lib/mail';
import { format } from 'date-fns';

export async function GET(req: Request) {
    try {
        // Authenticate the cron request if needed (e.g. using a secret header)
        const authHeader = req.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 65 * 60 * 1000); // 65 mins buffer

        // Find classes starting in the next ~hour that haven't sent reminders
        const upcomingClasses = await prisma.liveClass.findMany({
            where: {
                scheduledAt: {
                    gt: now,
                    lt: oneHourFromNow
                },
                reminderSent: false
            },
            include: {
                course: {
                    include: {
                        enrollments: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        console.log(`[CRON] Found ${upcomingClasses.length} upcoming classes for reminders.`);

        for (const liveClass of upcomingClasses) {
            const enrollments = (liveClass as any).course.enrollments;

            for (const enrollment of enrollments) {
                const user = enrollment.user;
                if (user.email) {
                    await sendLiveClassReminder(
                        user.email,
                        user.name || 'Student',
                        liveClass.title,
                        format(liveClass.scheduledAt, 'PPP p'),
                        liveClass.meetingUrl
                    );
                }
            }

            // Mark reminder as sent
            await prisma.liveClass.update({
                where: { id: liveClass.id },
                data: { reminderSent: true }
            });
        }

        return NextResponse.json({
            success: true,
            remindersSent: upcomingClasses.length
        });
    } catch (error) {
        console.error('[CRON_ERROR]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
