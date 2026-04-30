
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Video } from "lucide-react";
import { useRouter } from "next/navigation";

export const LiveClassNotificationTrigger = () => {
    const [notifiedClasses] = useState(new Set<string>());
    const router = useRouter();

    useEffect(() => {
        const checkClasses = async () => {
            try {
                const response = await fetch('/api/student/live-classes/upcoming');
                const { data } = await response.json();

                if (!data || !Array.isArray(data)) return;

                const now = new Date();

                interface LiveClass {
                    id: string;
                    title: string;
                    scheduledAt: string | Date;
                    meetingUrl: string;
                }

                data.forEach((liveClass: LiveClass) => {
                    const scheduledTime = new Date(liveClass.scheduledAt);
                    const diffMinutes = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);

                    // If class is starting in less than 10 minutes and more than -5 minutes (just started)
                    if (diffMinutes <= 10 && diffMinutes >= -5 && !notifiedClasses.has(liveClass.id)) {
                        notifiedClasses.add(liveClass.id);

                        toast.info(`Class Starting Soon: ${liveClass.title}`, {
                            description: `Starts in ${Math.ceil(diffMinutes)} minutes.`,
                            icon: <Video className="h-4 w-4 text-accent-cyan" />,
                            action: {
                                label: "Join Now",
                                onClick: () => window.open(liveClass.meetingUrl, '_blank')
                            },
                            duration: 10000,
                        });
                    }
                });
            } catch (error) {
                console.error("Failed to check for live classes", error);
            }
        };

        // Check every minute
        const interval = setInterval(checkClasses, 60000);
        checkClasses();

        return () => clearInterval(interval);
    }, [notifiedClasses]);

    return null;
};
