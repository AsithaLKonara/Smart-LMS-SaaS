
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Brain, Loader2, CheckCircle2, XCircle, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface AIQuizGeneratorProps {
    lessonId: string;
}

export const AIQuizGenerator = ({ lessonId }: AIQuizGeneratorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const fetchQuiz = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/ai/quiz", {
                method: "POST",
                body: JSON.stringify({ lessonId }),
            });
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error("Quiz generation failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (index: number) => {
        if (showResult) return;
        setSelectedOption(index);
        setShowResult(true);
        if (index === questions[currentIndex].correctIndex) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            setSelectedOption(null);
            setShowResult(false);
        } else {
            setIsFinished(true);
        }
    };

    const resetQuiz = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
        setIsFinished(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open && questions.length === 0) fetchQuiz();
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-accent-purple/50 text-accent-purple hover:bg-accent-purple/10">
                    <Brain className="h-4 w-4" />
                    AI Practice Quiz
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-background-elevated">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-accent-purple" />
                        Lesson Practice Quiz
                    </DialogTitle>
                    <DialogDescription>
                        Test your knowledge with AI-generated questions based on this lesson.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-accent-purple" />
                            <p className="text-sm text-text-secondary">AI is analyzing the lesson and creating your quiz...</p>
                        </div>
                    ) : isFinished ? (
                        <div className="text-center py-8 space-y-6">
                            <div className="h-24 w-24 rounded-full bg-accent-purple/20 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-12 w-12 text-accent-purple" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-text-primary">Quiz Complete!</h3>
                                <p className="text-text-secondary mt-1">You scored {score} out of {questions.length}</p>
                            </div>
                            <div className="flex justify-center gap-4">
                                <Button onClick={resetQuiz} variant="outline" className="gap-2">
                                    <RotateCcw className="h-4 w-4" /> Try Again
                                </Button>
                                <Button onClick={() => setIsOpen(false)}>Continue Learning</Button>
                            </div>
                        </div>
                    ) : questions.length > 0 ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-xs text-text-muted">
                                <span>Question {currentIndex + 1} of {questions.length}</span>
                                <span>Score: {score}</span>
                            </div>

                            <h3 className="text-lg font-medium text-text-primary leading-tight">
                                {questions[currentIndex].question}
                            </h3>

                            <div className="grid gap-3">
                                {questions[currentIndex].options.map((option, idx) => {
                                    const isCorrect = idx === questions[currentIndex].correctIndex;
                                    const isSelected = idx === selectedOption;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelect(idx)}
                                            disabled={showResult}
                                            className={cn(
                                                "p-4 rounded-xl border text-left transition-all relative overflow-hidden group",
                                                !showResult && "hover:border-accent-purple/50 hover:bg-white/5",
                                                showResult && isCorrect && "bg-green-500/10 border-green-500/50 text-green-400",
                                                showResult && isSelected && !isCorrect && "bg-red-500/10 border-red-500/50 text-red-400",
                                                !showResult && "bg-black/20 border-white/5",
                                                showResult && !isCorrect && !isSelected && "opacity-50 grayscale border-white/5"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="h-6 w-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                <span className="font-medium">{option}</span>
                                            </div>
                                            {showResult && isCorrect && (
                                                <CheckCircle2 className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                                            )}
                                            {showResult && isSelected && !isCorrect && (
                                                <XCircle className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {showResult && (
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-sm font-medium mb-1">Explanation:</p>
                                    <p className="text-sm text-text-secondary">{questions[currentIndex].explanation}</p>
                                    <Button onClick={handleNext} className="mt-4 w-full gap-2">
                                        {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-text-secondary">Failed to load quiz. Please try again.</p>
                            <Button onClick={fetchQuiz} className="mt-4">Retry</Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
