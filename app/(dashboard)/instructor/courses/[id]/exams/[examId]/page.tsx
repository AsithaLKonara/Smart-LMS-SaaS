
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/layout/Container";
import { ArrowLeft, LayoutDashboard, ListChecks, Timer } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

// Import Components
import { ExamTitleForm } from "./_components/ExamTitleForm";
import { ExamDurationForm } from "./_components/ExamDurationForm";
import { ExamQuestionsList } from "./_components/ExamQuestionsList";

export default async function ExamIdPage({
    params
}: {
    params: Promise<{ id: string; examId: string }>;
}) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return redirect("/");
    }

    const { id: courseId, examId } = await params;

    const exam = await prisma.exam.findUnique({
        where: {
            id: examId,
            courseId: courseId,
        },
    });

    if (!exam) {
        return redirect(`/instructor/courses/${courseId}/exams`);
    }

    const requiredFields = [
        exam.title,
        exam.duration,
        (exam.questions as any[])?.length > 0
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0">
            <Container className="py-8">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <Link
                            href={`/instructor/courses/${courseId}/exams`}
                            className="flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to exam list
                        </Link>
                        <h1 className="text-2xl font-medium text-text-primary">
                            Exam Setup
                        </h1>
                        <span className="text-sm text-text-secondary">
                            Complete all fields {completionText}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2 mb-4">
                                <div className="p-2 rounded-full bg-accent-cyan/10">
                                    <LayoutDashboard className="h-5 w-5 text-accent-cyan" />
                                </div>
                                <h2 className="text-xl font-medium text-text-primary">
                                    Customize your exam
                                </h2>
                            </div>
                            <Card variant="default" className="bg-background-elevated">
                                <CardHeader>
                                    <CardTitle>Exam Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ExamTitleForm
                                        initialData={exam}
                                        courseId={courseId}
                                        examId={examId}
                                    />
                                    <ExamDurationForm
                                        initialData={exam}
                                        courseId={courseId}
                                        examId={examId}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2 mb-4">
                                <div className="p-2 rounded-full bg-accent-purple/10">
                                    <ListChecks className="h-5 w-5 text-accent-purple" />
                                </div>
                                <h2 className="text-xl font-medium text-text-primary">
                                    Exam Questions
                                </h2>
                            </div>
                            <Card variant="default" className="bg-background-elevated">
                                <CardContent className="pt-6">
                                    <ExamQuestionsList
                                        initialData={exam}
                                        courseId={courseId}
                                        examId={examId}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
