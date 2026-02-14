"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { Platform } from "@prisma/client";

export async function createLiveClass(
    courseId: string,
    data: {
        title: string;
        description?: string;
        platform: Platform;
        meetingUrl: string;
        scheduledAt: Date;
        duration: number; // minutes
    }
) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        const liveClass = await prisma.liveClass.create({
            data: {
                courseId,
                title: data.title,
                platform: data.platform,
                meetingUrl: data.meetingUrl,
                scheduledAt: data.scheduledAt,
                duration: data.duration,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}/live`);
        return liveClass;
    } catch (error) {
        console.log("[CREATE_LIVE_CLASS]", error);
        throw new Error("Internal Error");
    }
}

export async function deleteLiveClass(
    courseId: string,
    liveClassId: string
) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        // Verify course ownership first
        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        // Verify live class belongs to course
        const liveClass = await prisma.liveClass.findUnique({
            where: {
                id: liveClassId,
            }
        });

        if (!liveClass || liveClass.courseId !== courseId) {
            throw new Error("Unauthorized or Not Found");
        }

        const deletedClass = await prisma.liveClass.delete({
            where: {
                id: liveClassId,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}/live`);
        return deletedClass;
    } catch (error) {
        console.log("[DELETE_LIVE_CLASS]", error);
        throw new Error("Internal Error");
    }
}
