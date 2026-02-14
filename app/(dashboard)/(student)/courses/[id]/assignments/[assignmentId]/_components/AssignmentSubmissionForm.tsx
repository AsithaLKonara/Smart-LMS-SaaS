
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Loader2, UploadCloud, FileText } from "lucide-react";
import { submitAssignment } from "@/app/actions/submissions";
import { format } from "date-fns";

// Schema for submission
const submissionSchema = z.object({
    content: z.string().optional(),
    fileUrl: z.string().optional(), // Can refine to URL if strict
}).refine(data => data.content || data.fileUrl, {
    message: "Either text content or a file URL must be provided.",
    path: ["content"]
});

interface AssignmentSubmissionFormProps {
    courseId: string;
    assignmentId: string;
    existingSubmission?: {
        content?: string | null;
        fileUrl?: string | null;
        submittedAt: Date;
    } | null;
}

export const AssignmentSubmissionForm = ({
    courseId,
    assignmentId,
    existingSubmission
}: AssignmentSubmissionFormProps) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof submissionSchema>>({
        resolver: zodResolver(submissionSchema),
        defaultValues: {
            content: existingSubmission?.content || "",
            fileUrl: existingSubmission?.fileUrl || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof submissionSchema>) => {
        try {
            await submitAssignment(courseId, assignmentId, {
                content: values.content,
                fileUrl: values.fileUrl
            });

            router.refresh();
            // Maybe toast success?
        } catch {
            setError("Failed to submit assignment");
        }
    };

    return (
        <div className="space-y-6">
            {existingSubmission && (
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-md mb-6">
                    <div className="flex items-center gap-2 text-green-500 font-medium mb-1">
                        <FileText className="h-4 w-4" />
                        Submitted on {format(new Date(existingSubmission.submittedAt), "PPP p")}
                    </div>
                    <p className="text-sm text-text-secondary">
                        You can resubmit below if the due date hasn't passed.
                    </p>
                </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Text Submission (Optional)</label>
                    <Textarea
                        {...form.register("content")}
                        disabled={isSubmitting}
                        placeholder="Write your answer or comments here..."
                        className="bg-background-elevated border-white/10 min-h-[150px]"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">File Link (File Upload placeholder)</label>
                    <div className="flex gap-2">
                        <Input
                            {...form.register("fileUrl")}
                            disabled={isSubmitting}
                            placeholder="Paste Google Drive / Dropbox link here..."
                            className="bg-background-elevated border-white/10"
                        />
                        <Button type="button" variant="outline" size="icon" disabled>
                            <UploadCloud className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-text-muted">
                        * For now, please paste a valid URL to your file (Google Drive, Dropbox, etc.)
                    </p>
                </div>

                {error && (
                    <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                        {error}
                    </div>
                )}

                {form.formState.errors.content && (
                    <div className="text-sm text-red-500">
                        {form.formState.errors.content.message}
                    </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={!isValid || isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {existingSubmission ? "Resubmit Assignment" : "Submit Assignment"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
