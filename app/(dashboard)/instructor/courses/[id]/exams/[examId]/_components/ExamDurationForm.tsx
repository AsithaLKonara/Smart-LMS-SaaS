
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Exam } from "@prisma/client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateExam } from "@/app/actions/exams";

interface ExamDurationFormProps {
    initialData: Exam;
    courseId: string;
    examId: string;
}

const formSchema = z.object({
    duration: z.coerce.number().min(5, {
        message: "Duration must be at least 5 minutes",
    }),
});

export const ExamDurationForm = ({
    initialData,
    courseId,
    examId,
}: ExamDurationFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            duration: initialData.duration,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateExam(courseId, examId, values);
            toggleEdit();
            router.refresh();
        } catch {
            // Toast error
        }
    };

    return (
        <div className="mt-6 border bg-transparent backdrop-blur-md rounded-md p-4 border-white/10">
            <div className="font-medium flex items-center justify-between text-text-primary">
                Exam Duration (Minutes)
                <Button onClick={toggleEdit} variant="ghost" size="sm">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit duration
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2 text-text-secondary">
                    {initialData.duration} minutes
                </p>
            )}
            {isEditing && (
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <div className="space-y-2">
                        <Input
                            type="number"
                            disabled={isSubmitting}
                            placeholder="e.g. 60"
                            {...form.register("duration")}
                        />
                        {form.formState.errors.duration && (
                            <p className="text-xs text-red-500">{form.formState.errors.duration.message}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};
