
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Exam } from "@prisma/client";
import { PlusCircle, Loader2, Trash, Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils/cn";
import { updateExam } from "@/app/actions/exams";

export type QuestionType = "MCQ" | "SHORT_ANSWER";

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    options?: string[];
    correctAnswer?: string;
    points: number;
}

interface ExamQuestionsListProps {
    initialData: Exam;
    courseId: string;
    examId: string;
}

export const ExamQuestionsList = ({
    initialData,
    courseId,
    examId,
}: ExamQuestionsListProps) => {
    const [questions, setQuestions] = useState<Question[]>(
        (initialData.questions as unknown as Question[]) || []
    );
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // New Question State
    const [newQuestionType, setNewQuestionType] = useState<QuestionType>("MCQ");
    const [newQuestionText, setNewQuestionText] = useState("");
    const [newQuestionPoints, setNewQuestionPoints] = useState(10);
    // MCQ specific
    const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>(["", ""]);
    const [newQuestionCorrectAnswer, setNewQuestionCorrectAnswer] = useState<string>("");

    const router = useRouter();

    const handleOptionChange = (index: number, value: string) => {
        const updated = [...newQuestionOptions];
        updated[index] = value;
        setNewQuestionOptions(updated);
    };

    const addOption = () => setNewQuestionOptions([...newQuestionOptions, ""]);

    const removeOption = (index: number) => {
        const updated = newQuestionOptions.filter((_, i) => i !== index);
        setNewQuestionOptions(updated);
    };

    const resetForm = () => {
        setNewQuestionText("");
        setNewQuestionPoints(10);
        setNewQuestionOptions(["", ""]);
        setNewQuestionCorrectAnswer("");
        setIsCreating(false);
    }

    const handleSaveQuestions = async (updatedQuestions: Question[]) => {
        try {
            setIsLoading(true);
            await updateExam(courseId, examId, {
                questions: updatedQuestions as any
            });
            setQuestions(updatedQuestions);
            router.refresh();
        } catch {
            // toast.error
        } finally {
            setIsLoading(false);
        }
    }

    const onAddQuestion = async () => {
        if (!newQuestionText) return;

        const newQuestion: Question = {
            id: self.crypto.randomUUID(),
            text: newQuestionText,
            type: newQuestionType,
            points: newQuestionPoints,
            ...(newQuestionType === "MCQ" && {
                options: newQuestionOptions.filter(o => o.trim() !== ""),
                correctAnswer: newQuestionCorrectAnswer
            })
        };

        const updated = [...questions, newQuestion];
        await handleSaveQuestions(updated);
        resetForm();
    };

    const onDeleteQuestion = async (questionId: string) => {
        const updated = questions.filter(q => q.id !== questionId);
        await handleSaveQuestions(updated);
    }


    return (
        <div className="mt-6 border bg-transparent backdrop-blur-md rounded-md p-4 border-white/10 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
                </div>
            )}

            <div className="font-medium flex items-center justify-between text-text-primary mb-4">
                Exam Questions ({questions.length})
                <Button onClick={() => setIsCreating(!isCreating)} variant="ghost" size="sm">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Question
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <div className="bg-background-elevated p-4 rounded-md border border-white/10 mb-4 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-medium text-text-secondary mb-1 block">Question Type</label>
                            <select
                                className="bg-background-secondary border border-white/10 rounded-md px-3 py-2 text-sm w-full"
                                value={newQuestionType}
                                onChange={(e) => setNewQuestionType(e.target.value as QuestionType)}
                            >
                                <option value="MCQ">Multiple Choice</option>
                                <option value="SHORT_ANSWER">Short Answer</option>
                            </select>
                        </div>
                        <div className="w-24">
                            <label className="text-xs font-medium text-text-secondary mb-1 block">Points</label>
                            <Input
                                type="number"
                                className="h-9"
                                value={newQuestionPoints}
                                onChange={e => setNewQuestionPoints(parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-text-secondary mb-1 block">Question Text</label>
                        <Textarea
                            placeholder="Enter the question..."
                            value={newQuestionText}
                            onChange={e => setNewQuestionText(e.target.value)}
                        />
                    </div>

                    {newQuestionType === "MCQ" && (
                        <div className="space-y-2 pl-4 border-l-2 border-white/10">
                            <label className="text-xs font-medium text-text-secondary mb-1 block">Options</label>
                            {newQuestionOptions.map((opt, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={newQuestionCorrectAnswer === opt && opt !== ""}
                                        onChange={() => setNewQuestionCorrectAnswer(opt)}
                                        className="accent-accent-cyan"
                                        disabled={opt === ""}
                                    />
                                    <Input
                                        className="h-8"
                                        placeholder={`Option ${idx + 1}`}
                                        value={opt}
                                        onChange={e => handleOptionChange(idx, e.target.value)}
                                    />
                                    <button onClick={() => removeOption(idx)} className="text-red-500 hover:text-red-400">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={addOption}
                                className="text-accent-cyan hover:text-accent-cyan/80 p-0 h-auto"
                            >
                                + Add Option
                            </Button>
                            <p className="text-xs text-text-secondary mt-1">Select the radio button next to the correct answer.</p>
                        </div>
                    )}

                    <Button className="w-full" onClick={onAddQuestion} disabled={!newQuestionText || (newQuestionType === "MCQ" && !newQuestionCorrectAnswer)}>
                        Save Question
                    </Button>
                </div>
            )}

            <div className="space-y-2">
                {questions.length === 0 && !isCreating && (
                    <div className="text-center text-sm text-text-secondary py-4 italic">
                        No questions added yet.
                    </div>
                )}
                {questions.map((q, index) => (
                    <div key={q.id} className="p-3 bg-background-elevated border border-white/10 rounded-md flex justify-between items-start group">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded">
                                    Q{index + 1}
                                </span>
                                <span className="text-xs text-text-secondary border border-white/10 px-2 py-0.5 rounded">
                                    {q.type === "MCQ" ? "Multiple Choice" : "Short Answer"}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    {q.points} pts
                                </span>
                            </div>
                            <p className="text-text-primary text-sm mb-2 font-medium">{q.text}</p>
                            {q.type === "MCQ" && q.options && (
                                <div className="grid grid-cols-1 gap-1 pl-2">
                                    {q.options.map((opt, i) => (
                                        <div key={i} className={cn(
                                            "text-xs px-2 py-1 rounded border",
                                            opt === q.correctAnswer
                                                ? "border-green-500/50 bg-green-500/10 text-green-200"
                                                : "border-transparent text-text-secondary"
                                        )}>
                                            {opt}
                                            {opt === q.correctAnswer && <Check className="inline h-3 w-3 ml-2" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button onClick={() => onDeleteQuestion(q.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-400">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
