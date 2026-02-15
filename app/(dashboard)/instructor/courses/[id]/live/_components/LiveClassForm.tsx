
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Platform } from "@prisma/client";

import { createLiveClass } from "@/app/actions/live-classes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

// Since we are using standard datetime-local, validation is string focused
const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Valid date is required"
    }),
    duration: z.coerce.number().min(15, { message: "Minimum 15 minutes" }),
    platform: z.nativeEnum(Platform).default(Platform.ZOOM),
    meetingUrl: z.string().url({ message: "Valid URL required" }),
});

interface LiveClassFormProps {
    courseId: string;
}

export const LiveClassForm = ({ courseId }: LiveClassFormProps) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            scheduledAt: "",
            duration: 60,
            platform: Platform.ZOOM,
            meetingUrl: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createLiveClass(courseId, {
                ...values,
                scheduledAt: new Date(values.scheduledAt),
            });

            router.push(`/instructor/courses/${courseId}/live`);
            router.refresh(); // Ensure list is updated
        } catch {
            setError("Something went wrong");
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Class Title</label>
                <Input
                    {...form.register("title")}
                    disabled={isSubmitting}
                    placeholder="e.g. Weekly Q&A Session"
                    className="bg-background-elevated border-white/10"
                />
                {form.formState.errors.title && (
                    <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Description (Optional)</label>
                <Textarea
                    {...form.register("description")}
                    disabled={isSubmitting}
                    placeholder="Briefly describe what this class covers..."
                    className="bg-background-elevated border-white/10"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Date & Time</label>
                    <Input
                        type="datetime-local"
                        {...form.register("scheduledAt")}
                        disabled={isSubmitting}
                        className="bg-background-elevated border-white/10 text-text-primary"
                    />
                    {form.formState.errors.scheduledAt && (
                        <p className="text-xs text-red-500">{form.formState.errors.scheduledAt.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Duration (Minutes)</label>
                    <Input
                        type="number"
                        {...form.register("duration")}
                        disabled={isSubmitting}
                        placeholder="60"
                        className="bg-background-elevated border-white/10"
                    />
                    {form.formState.errors.duration && (
                        <p className="text-xs text-red-500">{form.formState.errors.duration.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Platform</label>
                    <select
                        {...form.register("platform")}
                        disabled={isSubmitting}
                        className="flex h-10 w-full rounded-md border border-white/10 bg-background-elevated px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-text-primary"
                    >
                        {Object.values(Platform).map((platform) => (
                            <option key={platform} value={platform}>
                                {platform.replace("_", " ")}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Meeting URL</label>
                    <Input
                        {...form.register("meetingUrl")}
                        disabled={isSubmitting}
                        placeholder="https://zoom.us/j/..."
                        className="bg-background-elevated border-white/10"
                    />
                    {form.formState.errors.meetingUrl && (
                        <p className="text-xs text-red-500">{form.formState.errors.meetingUrl.message}</p>
                    )}
                </div>
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
                    Schedule Class
                </Button>
            </div>
        </form>
    );
};
