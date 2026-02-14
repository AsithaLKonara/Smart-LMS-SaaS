
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Loader2 } from "lucide-react";
import { updateLesson } from "@/app/actions/courses";

import { Button } from "@/components/ui/Button";
import { Editor } from "@/components/ui/Editor";
import { Preview } from "@/components/ui/Preview";

interface LessonDescriptionFormProps {
    initialData: {
        content: string | null;
    };
    courseId: string;
    moduleId: string;
    lessonId: string;
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const LessonDescriptionForm = ({
    initialData,
    courseId,
    moduleId,
    lessonId,
}: LessonDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: initialData.content || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateLesson(courseId, moduleId, lessonId, values);
            toggleEdit();
            router.refresh();
        } catch {
            console.error("Something went wrong");
        }
    };

    return (
        <div className="border border-white/10 rounded-md p-4 bg-background-elevated">
            <div className="flex items-center justify-between font-medium text-text-primary">
                Lesson Content
                <Button onClick={toggleEdit} variant="ghost" size="sm" className="hover:bg-white/5">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit content
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2 text-text-secondary",
                    !initialData.content && "italic"
                )}>
                    {initialData.content ? <Preview value={initialData.content} /> : "No content provided."}
                </div>
            )}
            {isEditing && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <Editor
                        value={form.watch("content")}
                        onChange={(value) => form.setValue("content", value, { shouldValidate: true })}
                    />
                    <div className="flex items-center gap-x-2">
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save changes
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
