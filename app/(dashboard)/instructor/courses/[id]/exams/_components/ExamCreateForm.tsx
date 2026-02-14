
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createExam } from "@/app/actions/exams";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
});

interface ExamCreateFormProps {
    courseId: string;
}

export const ExamCreateForm = ({ courseId }: ExamCreateFormProps) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const exam = await createExam(courseId, values.title);

            router.push(`/instructor/courses/${courseId}/exams/${exam.id}`);
            router.refresh();
        } catch {
            setError("Something went wrong");
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Exam Title</label>
                <Input
                    {...form.register("title")}
                    disabled={isSubmitting}
                    placeholder="e.g. Mid-term Assessment"
                    className="bg-background-elevated border-white/10"
                />
                {form.formState.errors.title && (
                    <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
                )}
            </div>

            {error && (
                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-x-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                    Continue
                </Button>
            </div>
        </form>
    );
};
