
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video, Pencil, Loader2 } from "lucide-react";
import { updateLesson } from "@/app/actions/courses";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { VideoPlayer } from "@/components/features/video/VideoPlayer";

interface LessonVideoFormProps {
    initialData: {
        videoProvider: string;
        videoExternalId: string | null;
    };
    courseId: string;
    moduleId: string;
    lessonId: string;
}

const formSchema = z.object({
    videoProvider: z.string(),
    videoExternalId: z.string().min(1),
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
            videoProvider: initialData.videoProvider || "YOUTUBE",
            videoExternalId: initialData.videoExternalId || "",
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
                Enterprise Video Integration
                <Button onClick={toggleEdit} variant="ghost" size="sm" className="hover:bg-white/5">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Manage Video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="mt-2">
                    <VideoPlayer 
                        provider={initialData.videoProvider as any} 
                        externalId={initialData.videoExternalId || ""} 
                    />
                </div>
            )}
            {isEditing && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase">Provider</label>
                        <select 
                            className="w-full bg-background-secondary border border-white/10 rounded-lg px-4 py-2 text-text-primary outline-none"
                            {...form.register("videoProvider")}
                        >
                            <option value="YOUTUBE">YouTube (Unlisted/Secure)</option>
                            <option value="VIMEO">Vimeo (Private)</option>
                            <option value="BUNNY_NET">Bunny.net (Encrypted HLS)</option>
                            <option value="WISTIA">Wistia</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase">External Video ID</label>
                        <input 
                            className="w-full bg-background-secondary border border-white/10 rounded-lg px-4 py-2 text-text-primary outline-none"
                            placeholder="e.g. dQw4w9WgXcQ"
                            {...form.register("videoExternalId")}
                        />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Update Video
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
