
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Wand2, Loader2, Plus, Check, ChevronRight, ListTree } from "lucide-react";
import { applyAIOutline } from "@/app/actions/courses";

interface AIModule {
    title: string;
    lessons: string[];
}

interface AIOutlineGeneratorProps {
    courseId: string;
}

export const AIOutlineGenerator = ({ courseId }: AIOutlineGeneratorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [outline, setOutline] = useState<AIModule[]>([]);

    const fetchOutline = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/ai/generate-outline", {
                method: "POST",
                body: JSON.stringify({ courseId }),
            });
            const data = await response.json();
            setOutline(data);
        } catch (error) {
            console.error("Outline generation failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async () => {
        setIsApplying(true);
        try {
            const result = await applyAIOutline(courseId, outline);
            if (result.success) {
                setIsOpen(false);
                // Page will revalidate automagically via server action
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert("Something went wrong");
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open && outline.length === 0) fetchOutline();
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-accent-cyan/50 text-accent-cyan hover:bg-accent-cyan/10">
                    <Wand2 className="h-4 w-4" />
                    AI Magic Outline
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-background-elevated max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-accent-cyan" />
                        AI Course Builder
                    </DialogTitle>
                    <DialogDescription>
                        AI has drafted a logical curriculum structure based on your course title and description.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-accent-cyan" />
                            <p className="text-sm text-text-secondary">Architecting your course structure...</p>
                        </div>
                    ) : outline.length > 0 ? (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {outline.map((module, mIdx) => (
                                    <div key={mIdx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-6 w-6 rounded-md bg-accent-cyan/20 flex items-center justify-center text-accent-cyan text-xs font-bold">
                                                {mIdx + 1}
                                            </div>
                                            <h4 className="font-bold text-text-primary">{module.title}</h4>
                                        </div>
                                        <ul className="space-y-2 ml-9">
                                            {module.lessons.map((lesson, lIdx) => (
                                                <li key={lIdx} className="text-sm text-text-secondary flex items-center gap-2">
                                                    <ChevronRight className="h-3 w-3 text-accent-cyan/50" />
                                                    {lesson}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-background-elevated pb-2">
                                <Button variant="ghost" onClick={() => fetchOutline()}>
                                    Regenerate
                                </Button>
                                <Button onClick={handleApply} disabled={isApplying} className="gap-2">
                                    {isApplying ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                    Apply Outline to Course
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-text-secondary">Failed to generate outline. Please ensure your course has a title and description.</p>
                            <Button onClick={fetchOutline} className="mt-4">Retry</Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
