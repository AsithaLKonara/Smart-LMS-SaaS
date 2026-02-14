
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Loader2, Video } from "lucide-react";
import { updateLesson } from "@/app/actions/courses";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface LessonVideoFormProps {
    initialData: {
        videoUrl: string | null;
    };
    courseId: string;
    moduleId: string;
    lessonId: string;
}

const formSchema = z.object({
    videoUrl: z.string().url("Must be a valid URL").min(1, {
        message: "Video URL is required",
    }),
});

export const LessonVideoForm = ({
    initialData,
    courseId,
    moduleId,
    lessonId,
}: LessonVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            videoUrl: initialData.videoUrl || "",
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
                Lesson Video
                <Button onClick={toggleEdit} variant="ghost" size="sm">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            {initialData.videoUrl ? (
                                <Pencil className="h-4 w-4 mr-2" />
                            ) : (
                                <Video className="h-4 w-4 mr-2" />
                            )}
                            {initialData.videoUrl ? "Edit video" : "Add video"}
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-800 rounded-md mt-4">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <div className="p-4 bg-slate-800 rounded-md break-all">
                            Video URL: <a href={initialData.videoUrl} target="_blank" className="text-accent-cyan underline">{initialData.videoUrl}</a>
                            <p className="text-xs text-text-muted mt-2">Embed preview pending implementation</p>
                        </div>
                    </div>
                )
            )}
            {isEditing && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <Input
                        {...form.register("videoUrl")}
                        placeholder="e.g. https://youtube.com/..."
                        className="bg-background-secondary border-none"
                        disabled={isSubmitting}
                    />
                    <div className="text-xs text-text-muted">
                        Enter a YouTube, Vimeo, or direct video link.
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
