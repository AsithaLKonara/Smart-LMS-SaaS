
import { prisma } from "../prisma";
import { isYesterday, isToday, startOfDay } from "date-fns";
import { BadgeType } from "@prisma/client";

/**
 * Updates or initializes the user's login streak.
 * Logic:
 * - If last active was today: do nothing.
 * - If last active was yesterday: increment current streak.
 * - Otherwise: reset current streak to 1.
 */
export async function updateStreak(userId: string) {
    const streak = await prisma.streak.upsert({
        where: { userId },
        update: {},
        create: {
            userId,
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: new Date(0),
        },
    });

    const lastActive = streak.lastActiveDate ? startOfDay(streak.lastActiveDate) : new Date(0);
    const today = startOfDay(new Date());

    if (isToday(lastActive)) {
        return streak;
    }

    let newStreak = streak.currentStreak;
    if (isYesterday(lastActive)) {
        newStreak += 1;
    } else {
        newStreak = 1;
    }

    const updatedStreak = await prisma.streak.update({
        where: { userId },
        data: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, streak.longestStreak),
            lastActiveDate: new Date(),
        },
    });

    return updatedStreak;
}

export async function getStreak(userId: string) {
    return prisma.streak.findUnique({
        where: { userId },
    });
}

/**
 * Badge System
 */
export async function getBadges(userId: string) {
    return prisma.badge.findMany({
        where: { userId },
        orderBy: { earnedAt: "desc" },
    });
}

export async function awardBadge(userId: string, type: BadgeType) {
    const existing = await prisma.badge.findFirst({
        where: { userId, type },
    });

    if (existing) return existing;

    // Award notification or similar could be added here
    return prisma.badge.create({
        data: {
            userId,
            type,
        },
    });
}
