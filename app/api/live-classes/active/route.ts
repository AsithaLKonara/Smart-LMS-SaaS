
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { addMinutes, subMinutes } from "date-fns";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        // Classes starting in the last 5 mins or next 5 mins
        const windowStart = subMinutes(now, 5);
        const windowEnd = addMinutes(now, 5);

        const activeClasses = await prisma.liveClass.findMany({
            where: {
                scheduledAt: {
                    gte: windowStart,
                    lte: windowEnd,
                },
                course: {
                    enrollments: {
                        some: {
                            userId: session.user.id,
                        },
                    },
                },
            },
            select: {
                id: true,
                title: true,
                meetingUrl: true,
            },
        });

        return NextResponse.json({ success: true, classes: activeClasses });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
