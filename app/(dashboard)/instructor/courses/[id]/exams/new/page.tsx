
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/layout/Container";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ExamCreateForm } from "../_components/ExamCreateForm";

export default async function CreateExamPage({
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
    });

    if (!course) {
        return redirect("/instructor/courses");
    }

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0">
            <Container className="py-8">
                <div className="flex flex-col gap-y-2 mb-8">
                    <Link
                        href={`/instructor/courses/${courseId}/exams`}
                        className="flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to exams
                    </Link>
                    <h1 className="text-2xl font-medium text-text-primary">
                        Create New Exam
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Start by giving your exam a title. You can add questions and configure details in the next step.
                    </p>
                </div>

                <div className="max-w-2xl p-6 rounded-md bg-background-elevated border border-white/10">
                    <ExamCreateForm courseId={courseId} />
                </div>
            </Container>
        </div>
    );
}
