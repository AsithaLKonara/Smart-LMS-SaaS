
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Loader2 } from "lucide-react";
import { updateLesson } from "@/app/actions/courses";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface LessonTitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
    moduleId: string;
    lessonId: string;
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

export const LessonTitleForm = ({
    initialData,
    courseId,
    moduleId,
    lessonId,
}: LessonTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting, isValid } = form.formState;

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateLesson(courseId, moduleId, lessonId, values);
            toggleEdit();
            router.refresh();
            // toast.success("Lesson updated");
        } catch {
            // toast.error("Something went wrong");
        }
    };

    return (
        <div className="border border-white/10 rounded-md p-4 bg-background-elevated">
            <div className="flex items-center justify-between font-medium text-text-primary">
                Lesson title
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="flex items-center gap-x-2">
                        <Input
                            disabled={isSubmitting}
                            placeholder="e.g. 'Introduction to the course'"
                            {...form.register("title")}
                            className="bg-background-secondary border-none"
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
