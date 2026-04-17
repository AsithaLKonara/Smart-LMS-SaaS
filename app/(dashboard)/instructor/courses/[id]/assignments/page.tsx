
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PlusCircle, FileText, ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { AssignmentActions } from "./_components/AssignmentActions";
import { format } from "date-fns";

export default async function AssignmentsPage({
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
            assignments: {
                orderBy: {
                    dueDate: "asc",
                },
            },
        },
    });

    if (!course) {
        return redirect("/instructor/courses");
    }

    return (
        <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
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
                        <h1 className="text-2xl font-medium text-text-primary font-heading">
                            Assignments for {course.title}
                        </h1>
                    </div>
                    <Link href={`/instructor/courses/${courseId}/assignments/new`}>
                        <Button>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create Assignment
                        </Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    {course.assignments.length === 0 && (
                        <div className="text-center text-sm text-text-secondary mt-10">
                            No assignments created yet.
                        </div>
                    )}
                    {course.assignments.map((assignment) => (
                        <div
                            key={assignment.id}
                            className="flex items-center justify-between p-4 glass border-white/10 rounded-lg glass-hover"
                        >
                            <div className="flex items-center gap-x-4">
                                <div className="p-2 rounded-full bg-green-500/10">
                                    <FileText className="h-6 w-6 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-text-primary font-medium">{assignment.title}</h3>
                                    <div className="text-sm text-text-secondary flex gap-x-2">
                                        {assignment.dueDate && (
                                            <span>Due: {format(new Date(assignment.dueDate), "PPP")}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Link href={`/instructor/courses/${courseId}/assignments/${assignment.id}`}>
                                    <Button size="sm" variant="ghost">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <AssignmentActions assignmentId={assignment.id} courseId={courseId} />
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
