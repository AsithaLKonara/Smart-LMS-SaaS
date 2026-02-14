
"use client";

import { useHeartbeat } from "@/hooks/useHeartbeat";

interface HeartbeatTriggerProps {
    enrollmentId: string;
    lessonId: string;
}

export const HeartbeatTrigger = ({ enrollmentId, lessonId }: HeartbeatTriggerProps) => {
    useHeartbeat(enrollmentId, lessonId);
    return null; // Invisible component
};
