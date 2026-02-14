"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { publishCourse, unpublishCourse } from "@/app/actions/courses";

interface PublicationControlsProps {
    courseId: string;
    isPublished: boolean;
    disabled: boolean;
}

export const PublicationControls = ({
    courseId,
    isPublished,
    disabled
}: PublicationControlsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await unpublishCourse(courseId);
                // toast.success("Course unpublished");
            } else {
                await publishCourse(courseId);
                // toast.success("Course published");
                // router.push(`/courses/${courseId}`); // Optional redirect
            }

            router.refresh();
        } catch {
            // toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant={isPublished ? "outline" : "primary"}
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
        </div>
    )
}
