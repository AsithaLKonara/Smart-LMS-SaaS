
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deleteExam } from "@/app/actions/exams";

interface ExamActionsProps {
    courseId: string;
    examId: string;
}

export const ExamActions = ({
    courseId,
    examId
}: ExamActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await deleteExam(courseId, examId);
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
                if (window.confirm("Are you sure you want to delete this exam?")) {
                    onDelete();
                }
            }}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4 text-red-500" />}
        </Button>
    )
}
