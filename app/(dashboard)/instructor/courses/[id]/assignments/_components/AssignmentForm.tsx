
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Assignment } from "@prisma/client";
import { createAssignment, updateAssignment } from "@/app/actions/assignments";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    attachmentUrl: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
    totalPoints: z.coerce.number().min(0).max(1000),
    dueDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid date"
    }),
});

interface AssignmentFormProps {
    courseId: string;
    initialData?: Assignment;
}

export const AssignmentForm = ({ courseId, initialData }: AssignmentFormProps) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            attachmentUrl: initialData?.attachmentUrl || "",
            totalPoints: initialData?.totalPoints || 100,
            dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const payload = {
                ...values,
                dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
                attachmentUrl: values.attachmentUrl || undefined,
            };

            if (initialData) {
                await updateAssignment(courseId, initialData.id, payload);
                router.push(`/instructor/courses/${courseId}/assignments`);
            } else {
                await createAssignment(courseId, payload);
                router.push(`/instructor/courses/${courseId}/assignments`);
            }
            router.refresh();
        } catch {
            setError("Something went wrong");
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Assignment Title</label>
                    <Input
                        {...form.register("title")}
                        disabled={isSubmitting}
                        placeholder="e.g. Final Project Submission"
                        className="bg-background-secondary border-white/5"
                    />
                    {form.formState.errors.title && (
                        <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Total Points</label>
                    <Input
                        type="number"
                        {...form.register("totalPoints")}
                        disabled={isSubmitting}
                        className="bg-background-secondary border-white/5"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Description</label>
                <Textarea
                    {...form.register("description")}
                    disabled={isSubmitting}
                    placeholder="Detailed instructions for the assignment..."
                    className="bg-background-secondary border-white/5 min-h-[120px]"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Attachment URL (Optional)</label>
                    <Input
                        {...form.register("attachmentUrl")}
                        disabled={isSubmitting}
                        placeholder="Link to template or reference material"
                        className="bg-background-secondary border-white/5"
                    />
                    {form.formState.errors.attachmentUrl && (
                        <p className="text-xs text-red-500">{form.formState.errors.attachmentUrl.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Due Date</label>
                    <Input
                        type="datetime-local"
                        {...form.register("dueDate")}
                        disabled={isSubmitting}
                        className="bg-background-secondary border-white/5"
                    />
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-x-2 pt-4 border-t border-white/5">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Assignment" : "Create Assignment"}
                </Button>
            </div>
        </form>
    );
};
