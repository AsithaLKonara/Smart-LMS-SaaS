
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2, Save, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { gradeSubmission } from "@/app/actions/submissions";

interface Submission {
    id: string;
    submittedAt: Date;
    content: string | null;
    fileUrl: string | null;
    grade: number | null;
    feedback: string | null;
    user: {
        name: string;
        email: string;
    }
}

interface SubmissionsListProps {
    courseId: string;
    submissions: Submission[];
}

export const SubmissionsList = ({
    courseId,
    submissions
}: SubmissionsListProps) => {
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

    const onGrade = async (submissionId: string, grade: number, feedback: string) => {
        try {
            setLoadingIds(prev => new Set(prev).add(submissionId));
            await gradeSubmission(courseId, submissionId, grade, feedback);
            // toast success
        } catch {
            // toast error
        } finally {
            setLoadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(submissionId);
                return newSet;
            });
        }
    }

    if (submissions.length === 0) {
        return <div className="text-center text-text-secondary py-10">No submissions yet.</div>;
    }

    return (
        <div className="space-y-4">
            {submissions.map((submission) => (
                <div key={submission.id} className="bg-background-elevated border border-white/10 rounded-md p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-text-primary font-medium">{submission.user.name}</h3>
                            <p className="text-sm text-text-secondary">{submission.user.email}</p>
                            <p className="text-xs text-text-muted mt-1">
                                Submitted: {format(new Date(submission.submittedAt), "PPP p")}
                            </p>
                        </div>
                    </div>

                    <div className="bg-background-primary p-3 rounded mb-4 border border-white/5">
                        {submission.content && (
                            <div className="mb-2">
                                <p className="text-xs text-text-secondary font-medium mb-1">TEXT SUBMISSION</p>
                                <p className="text-sm text-text-primary whitespace-pre-wrap">{submission.content}</p>
                            </div>
                        )}
                        {submission.fileUrl && (
                            <div className="mt-2">
                                <p className="text-xs text-text-secondary font-medium mb-1">FILE ATTACHMENT</p>
                                <a
                                    href={submission.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent-cyan text-sm hover:underline flex items-center gap-1"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    View File
                                </a>
                            </div>
                        )}
                    </div>

                    <GradingForm
                        initialGrade={submission.grade}
                        initialFeedback={submission.feedback}
                        submissionId={submission.id}
                        isLoading={loadingIds.has(submission.id)}
                        onSave={onGrade}
                    />
                </div>
            ))}
        </div>
    );
}

const GradingForm = ({
    initialGrade,
    initialFeedback,
    submissionId,
    isLoading,
    onSave
}: {
    initialGrade: number | null,
    initialFeedback: string | null,
    submissionId: string,
    isLoading: boolean,
    onSave: (id: string, grade: number, feedback: string) => void
}) => {
    const [grade, setGrade] = useState(initialGrade !== null ? initialGrade.toString() : "");
    const [feedback, setFeedback] = useState(initialFeedback || "");
    const [isDirty, setIsDirty] = useState(false);

    const handleSave = () => {
        const numGrade = parseFloat(grade);
        if (isNaN(numGrade)) return;
        onSave(submissionId, numGrade, feedback);
        setIsDirty(false);
    }

    return (
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <div className="flex gap-4">
                <div className="w-24">
                    <label className="text-xs text-text-secondary mb-1 block">Grade (0-100)</label>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        value={grade}
                        onChange={(e) => {
                            setGrade(e.target.value);
                            setIsDirty(true);
                        }}
                        className="h-8"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-xs text-text-secondary mb-1 block">Feedback</label>
                    <Input
                        placeholder="Great job!"
                        value={feedback}
                        onChange={(e) => {
                            setFeedback(e.target.value);
                            setIsDirty(true);
                        }}
                        className="h-8"
                    />
                </div>
                <div className="flex items-end">
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isLoading || !isDirty || !grade}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}
