
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Loader2 } from "lucide-react";
import { updateLesson } from "@/app/actions/courses";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

interface LessonAccessFormProps {
    initialData: {
        isFree: boolean;
    };
    courseId: string;
    moduleId: string;
    lessonId: string;
}

const formSchema = z.object({
    isFree: z.boolean().default(false),
});

export const LessonAccessForm = ({
    initialData,
    courseId,
    moduleId,
    lessonId,
}: LessonAccessFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree,
        },
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
                Lesson Access
                <Button onClick={toggleEdit} variant="ghost" size="sm">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={!!initialData.isFree ? "text-accent-cyan mt-2" : "text-text-secondary mt-2"}>
                    {initialData.isFree ? "This lesson is free for preview." : "This lesson is locked (paid)."}
                </div>
            )}
            {isEditing && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isFree"
                            checked={form.watch("isFree")}
                            // Native checkbox onChange passes event, we need the checked state
                            onChange={(e) => form.setValue("isFree", e.target.checked)}
                            disabled={isSubmitting}
                        />
                        <div className="text-sm">
                            Check this box if you want this lesson to be free for preview.
                        </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            {isSubmitting?.toString() === 'true' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
