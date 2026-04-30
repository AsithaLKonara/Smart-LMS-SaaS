
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/layout/Container";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SubmissionsList } from "./_components/SubmissionsList";
import { AssignmentForm } from "../_components/AssignmentForm";

export default async function EditAssignmentPage({
    params
}: {
    params: Promise<{ id: string; assignmentId: string }>;
}) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return redirect("/");
    }

    const { id: courseId, assignmentId } = await params;

    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
            instructorId: userId,
        },
        include: {
            assignments: {
                where: {
                    id: assignmentId
                },
                include: {
                    submissions: {
                        orderBy: {
                            submittedAt: 'desc'
                        },
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!course || course.assignments.length === 0) {
        return redirect(`/instructor/courses/${courseId}/assignments`);
    }

    const assignment = course.assignments[0];

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0">
            <Container className="py-8">
                <div className="flex flex-col gap-y-2 mb-8">
                    <Link
                        href={`/instructor/courses/${courseId}/assignments`}
                        className="flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to assignments
                    </Link>
                    <h1 className="text-2xl font-medium text-text-primary">
                        Edit Assignment
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <div className="h-8 w-1 bg-accent-cyan rounded-full" />
                            <h2 className="text-xl font-semibold text-text-primary">Settings</h2>
                        </div>
                        <div className="p-6 rounded-md bg-background-elevated border border-white/10">
                            <AssignmentForm courseId={courseId} initialData={assignment} />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <div className="h-8 w-1 bg-accent-purple rounded-full" />
                            <h2 className="text-xl font-semibold text-text-primary">
                                Submissions ({assignment.submissions.length})
                            </h2>
                        </div>
                        <SubmissionsList courseId={courseId} submissions={assignment.submissions} />
                    </div>
                </div>
            </Container>
        </div>
    );
}
