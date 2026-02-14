
"use client";

import { useEffect, useRef } from "react";

export const useHeartbeat = (enrollmentId: string, lessonId: string, intervalMs: number = 30000) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!enrollmentId || !lessonId) return;

        const sendHeartbeat = async () => {
            try {
                await fetch("/api/lessons/heartbeat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        enrollmentId,
                        lessonId,
                        increment: Math.floor(intervalMs / 1000),
                    }),
                });
            } catch (error) {
                console.error("Heartbeat failed", error);
            }
        };

        timerRef.current = setInterval(sendHeartbeat, intervalMs);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [enrollmentId, lessonId, intervalMs]);
};
