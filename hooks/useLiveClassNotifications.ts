
"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const useLiveClassNotifications = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session?.user) return;

        const checkActiveClasses = async () => {
            try {
                const response = await fetch("/api/live-classes/active");
                const data = await response.json();

                if (data.success && data.classes.length > 0) {
                    interface LiveClass {
                        id: string;
                        title: string;
                    }

                    data.classes.forEach((liveClass: LiveClass) => {
                        toast("Class Starting Now!", {
                            description: `${liveClass.title} is starting. Join now to participate.`,
                            action: {
                                label: "Join",
                                onClick: () => router.push(`/live`),
                            },
                        });
                    });
                }
            } catch (error) {
                console.error("Failed to fetch active live classes", error);
            }
        };

        // Check every 2 minutes
        const interval = setInterval(checkActiveClasses, 120000);
        checkActiveClasses(); // Initial check

        return () => clearInterval(interval);
    }, [session, router]);
};
