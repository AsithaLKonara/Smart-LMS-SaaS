
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Exam, ExamAttempt } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils/cn";
import { submitExam, updateExamProgress } from "@/app/actions/exam-attempts";
import { Loader2, Timer, AlertCircle, Save } from "lucide-react";
import { format } from "date-fns";

interface Question {
    id: string;
    text: string;
    type: "MCQ" | "SHORT_ANSWER";
    options?: string[];
    points: number;
}

interface ExamRunnerProps {
    courseId: string;
    examId: string;
    exam: Exam & { questions: Question[] };
    attempt: ExamAttempt;
}

export const ExamRunner = ({
    courseId,
    examId,
    exam,
    attempt
}: ExamRunnerProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>(
        (attempt.answers as Record<string, string>) || {}
    );
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const questions = exam.questions as Question[];
    const currentQuestion = questions[currentQuestionIndex];
    const [lastSaved, setLastSaved] = useState<Date>(new Date());

    const saveProgress = useCallback(async () => {
        try {
            await updateExamProgress(attempt.id, answers);
            setLastSaved(new Date());
        } catch (error) {
            console.error("Failed to save progress", error);
        }
    }, [attempt.id, answers]);

    // Auto-save every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            saveProgress();
        }, 30000);
        return () => clearInterval(interval);
    }, [saveProgress]);

    // Timer Logic
    useEffect(() => {
        if (!exam.duration) return;

        const startTime = new Date(attempt.createdAt).getTime();
        const durationMs = exam.duration * 60 * 1000;
        const endTime = startTime + durationMs;

        const updateTimer = () => {
            const now = Date.now();
            const remain = Math.max(0, endTime - now);
            setTimeLeft(Math.floor(remain / 1000));

            if (remain <= 0 && !isLoading) {
                // Time up! Auto submit
                handleSubmit(true);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [exam.duration, attempt.createdAt, isLoading, handleSubmit]);

    const handleAnswerChange = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));
    };

    const handleNext = () => {
        saveProgress();
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        saveProgress();
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = useCallback(async (autoSubmit = false) => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            await submitExam(courseId, examId, answers);
            if (autoSubmit) {
                // Show auto-submit toast
            }
            router.refresh(); // Or redirect to result page
            // Redirect happens via server component re-rendering if logic handles it, or explicit push
            router.push(`/courses/${courseId}/exams/${examId}/result`);
        } catch {
            // error
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, courseId, examId, answers, router]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <AlertCircle className="h-10 w-10 text-yellow-500 mb-4" />
                <h2 className="text-xl font-medium">No questions found</h2>
                <p className="text-text-secondary">This exam has no questions configured.</p>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header: Timer & Progress */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-transparent backdrop-blur-md z-10 py-4 border-b border-white/10">
                <div className="flex items-center gap-x-4">
                    <h1 className="text-xl font-bold text-text-primary">{exam.title}</h1>
                    <span className="text-sm text-text-secondary">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                </div>
                {timeLeft !== null && (
                    <div className={cn(
                        "flex items-center gap-x-2 px-3 py-1.5 rounded-md font-mono font-medium",
                        timeLeft < 60 ? "bg-red-500/10 text-red-500" : "bg-accent-cyan/10 text-accent-cyan"
                    )}>
                        <Timer className="h-4 w-4" />
                        {formatTime(timeLeft)}
                    </div>
                )}
                <div className="text-xs text-text-secondary flex items-center gap-1">
                    <Save className="h-3 w-3" />
                    Saved {format(lastSaved, 'h:mm a')}
                </div>
            </div>

            {/* Question Card */}
            <Card variant="default" className="bg-background-elevated min-h-[400px]">
                <CardContent className="p-8">
                    <div className="mb-6">
                        <p className="text-lg font-medium text-text-primary mb-2">
                            {currentQuestion.text}
                        </p>
                        <span className="text-xs text-text-secondary bg-white/5 px-2 py-1 rounded">
                            {currentQuestion.points} Points
                        </span>
                    </div>

                    <div className="space-y-4">
                        {currentQuestion.type === "MCQ" && currentQuestion.options && (
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, idx) => (
                                    <div key={idx}
                                        className={cn(
                                            "flex items-center p-3 rounded-md border cursor-pointer hover:bg-background-secondary transition-colors",
                                            answers[currentQuestion.id] === option
                                                ? "border-accent-cyan bg-accent-cyan/5"
                                                : "border-white/10 bg-transparent backdrop-blur-md"
                                        )}
                                        onClick={() => handleAnswerChange(option)}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded-full border mr-3 flex items-center justify-center",
                                            answers[currentQuestion.id] === option ? "border-accent-cyan" : "border-text-secondary"
                                        )}>
                                            {answers[currentQuestion.id] === option && <div className="w-2 h-2 rounded-full bg-accent-cyan" />}
                                        </div>
                                        <span className="text-text-primary">{option}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === "SHORT_ANSWER" && (
                            <Textarea
                                placeholder="Type your answer here..."
                                className="min-h-[200px] resize-none text-lg bg-transparent backdrop-blur-md border-white/10"
                                value={answers[currentQuestion.id] || ""}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    disabled={currentQuestionIndex === 0 || isLoading}
                    onClick={handlePrev}
                >
                    Previous
                </Button>

                {currentQuestionIndex < questions.length - 1 ? (
                    <Button
                        onClick={handleNext}
                        disabled={isLoading}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={isLoading}
                        className={isLoading ? "opacity-50" : ""}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Exam
                    </Button>
                )}
            </div>
        </div>
    );
}
