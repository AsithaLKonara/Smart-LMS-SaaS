
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/layout/Container";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { AssignmentSubmissionForm } from "./_components/AssignmentSubmissionForm";
import { Card, CardContent } from "@/components/ui/Card";

export default async function AssignmentSubmissionPage({
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

    // Fetch Assignment and existing Submission if any
    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId,
            courseId: courseId,
        },
        include: {
            submissions: {
                where: {
                    userId: userId
                },
                take: 1
            }
        }
    });

    if (!assignment) {
        return redirect(`/courses/${courseId}`);
    }

    const existingSubmission = assignment.submissions[0];

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0">
            <Container className="py-8">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href={`/courses/${courseId}`}
                        className="flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Course
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Assignment Details */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-text-primary mb-4 font-heading">
                                    {assignment.title}
                                </h1>
                                {assignment.description && (
                                    <div className="prose prose-invert max-w-none text-text-secondary">
                                        {/* Assuming plain text for now, could be Markdown */}
                                        <p className="whitespace-pre-line">{assignment.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Submission Form */}
                            <div className="pt-8 border-t border-white/10">
                                <h2 className="text-xl font-semibold text-text-primary mb-4">
                                    Your Submission
                                </h2>
                                <AssignmentSubmissionForm
                                    courseId={courseId}
                                    assignmentId={assignmentId}
                                    existingSubmission={existingSubmission}
                                />
                            </div>
                        </div>

                        {/* Sidebar: Info */}
                        <div className="md:col-span-1">
                            <Card variant="glass-dark" className="sticky top-8 glass-hover">
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <span className="text-xs font-medium text-text-secondary block mb-1">DUE DATE</span>
                                        <div className="flex items-center gap-2 text-text-primary">
                                            <Calendar className="h-4 w-4 text-accent-cyan" />
                                            {assignment.dueDate
                                                ? format(new Date(assignment.dueDate), "PPP p")
                                                : "No Due Date"
                                            }
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <span className="text-xs font-medium text-text-secondary block mb-1">STATUS</span>
                                        <div className="flex items-center gap-2">
                                            {existingSubmission ? (
                                                <span className="text-green-500 font-medium flex items-center gap-1">
                                                    <FileText className="h-4 w-4" /> Submitted
                                                </span>
                                            ) : (
                                                <span className="text-yellow-500 font-medium">Pending Submission</span>
                                            )}
                                        </div>
                                    </div>
                                    {existingSubmission?.grade !== null && existingSubmission?.grade !== undefined && (
                                        <div className="pt-4 border-t border-white/10">
                                            <span className="text-xs font-medium text-text-secondary block mb-1">GRADE</span>
                                            <span className="text-xl font-bold text-accent-purple">
                                                {existingSubmission.grade}/100
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
