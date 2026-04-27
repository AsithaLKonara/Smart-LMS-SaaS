
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PlusCircle, FileText, ArrowLeft, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// I'll need a delete action component similar to LiveClass
import { ExamActions } from "./_components/ExamActions";

export default async function ExamsPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return redirect("/");
    }

    const { id: courseId } = await params;

    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
            instructorId: userId,
        },
        include: {
            exams: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!course) {
        return redirect("/instructor/courses");
    }

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0">
            <Container className="py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-y-2">
                        <Link
                            href={`/instructor/courses/${courseId}`}
                            className="flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>
                        <h1 className="text-2xl font-medium text-text-primary">
                            Exams for {course.title}
                        </h1>
                    </div>
                    <Link href={`/instructor/courses/${courseId}/exams/new`}>
                        <Button>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create Exam
                        </Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    {course.exams.length === 0 && (
                        <div className="text-center text-sm text-text-secondary mt-10">
                            No exams created yet.
                        </div>
                    )}
                    {course.exams.map((exam) => (
                        <div
                            key={exam.id}
                            className="flex items-center justify-between p-4 border border-white/10 rounded-md bg-background-elevated"
                        >
                            <div className="flex items-center gap-x-4">
                                <div className="p-2 rounded-full bg-accent-cyan/10">
                                    <FileText className="h-6 w-6 text-accent-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-text-primary font-medium">{exam.title}</h3>
                                    <div className="text-sm text-text-secondary flex gap-x-2">
                                        <span>{exam.duration} mins</span>
                                        <span>•</span>
                                        <span>{/* exam.questions.length */} Questions</span>
                                        {/* Questions is Json, might need to cast or just check standard array length if possible in server component without strict typing issues? Prisma returns JsonValue. */}
                                        {/* I'll skip question count for now or cast carefully */}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Link href={`/instructor/courses/${courseId}/exams/${exam.id}`}>
                                    <Button size="sm" variant="ghost">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <ExamActions examId={exam.id} courseId={courseId} />
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
