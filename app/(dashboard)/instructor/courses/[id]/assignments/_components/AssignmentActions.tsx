
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deleteAssignment } from "@/app/actions/assignments";

interface AssignmentActionsProps {
    courseId: string;
    assignmentId: string;
}

export const AssignmentActions = ({
    courseId,
    assignmentId
}: AssignmentActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await deleteAssignment(courseId, assignmentId);
            router.refresh();
        } catch {
            // toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            size="sm"
            variant="ghost"
            disabled={isLoading}
            className="hover:bg-red-500/10 hover:text-red-500"
            onClick={() => {
                if (window.confirm("Are you sure you want to delete this assignment?")) {
                    onDelete();
                }
            }}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4 text-red-500" />}
        </Button>
    )
}
