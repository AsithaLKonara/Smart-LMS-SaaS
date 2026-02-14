
"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils/cn";

interface SummarizeButtonProps {
    lessonId: string;
}

export const SummarizeButton = ({ lessonId }: SummarizeButtonProps) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSummarize = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/ai/summarize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ lessonId })
            });

            if (!res.ok) throw new Error("Failed");

            const data = await res.json();
            setSummary(data.summary);
        } catch {
            setSummary("Failed to generate summary. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-accent-purple hover:text-accent-purple hover:bg-accent-purple/10 border-accent-purple/20"
                    onClick={() => {
                        if (!summary) onSummarize();
                    }}
                >
                    <Sparkles className="h-4 w-4" />
                    AI Summary
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background-elevated border-white/10 text-text-primary">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent-purple" />
                        Lesson Summary
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-accent-cyan" />
                            <p className="text-sm text-text-secondary animate-pulse">Analyzing lesson content...</p>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none text-text-secondary whitespace-pre-wrap">
                            {summary}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
