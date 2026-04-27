
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

interface ExamTitleFormProps {
    initialData: Exam;
    courseId: string;
    examId: string;
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

export const ExamTitleForm = ({
    initialData,
    courseId,
    examId,
}: ExamTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData.title,
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
                Exam Title
                <Button onClick={toggleEdit} variant="ghost" size="sm">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2 text-text-secondary">
                    {initialData.title}
                </p>
            )}
            {isEditing && (
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <div className="space-y-2">
                        <Input
                            disabled={isSubmitting}
                            placeholder="e.g. 'Advanced React Exam'"
                            {...form.register("title")}
                        />
                        {form.formState.errors.title && (
                            <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
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
