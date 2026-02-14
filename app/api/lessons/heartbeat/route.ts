
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { enrollmentId, lessonId, increment = 30 } = await req.json();

        if (!enrollmentId || !lessonId) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const progress = await prisma.lessonProgress.update({
            where: {
                enrollmentId_lessonId: {
                    enrollmentId,
                    lessonId,
                },
            },
            data: {
                timeSpent: {
                    increment,
                },
            },
        });

        return NextResponse.json({ timeSpent: progress.timeSpent });
    } catch (error) {
        console.error("[HEARTBEAT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
