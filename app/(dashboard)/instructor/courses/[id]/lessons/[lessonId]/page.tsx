
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, LayoutDashboard, Video, FileText, Lock } from "lucide-react";
import Link from "next/link";
import { LessonTitleForm } from "./_components/LessonTitleForm";
import { LessonDescriptionForm } from "./_components/LessonDescriptionForm";
import { LessonAccessForm } from "./_components/LessonAccessForm";
import { LessonVideoForm } from "./_components/LessonVideoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function LessonIdPage({
    params
}: {
    params: Promise<{
        id: string;
        lessonId: string;
    }>;
}) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return redirect("/");
    }

    const { id: courseId, lessonId } = await params;

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
            module: {
                course: {
                    instructorId: userId,
                }
            }
        },
        include: {
            module: {
                select: {
                    id: true,
                    title: true,
                }
            },
            // muxData: true, // If we add Mux later
        },
    });

    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
            instructorId: userId
        }
    })

    // If the lesson isn't found or doesn't belong to the user's course
    if (!lesson || !course) {
        return redirect("/instructor/courses");
    }

    const requiredFields = [
        lesson.title,
        // lesson.description,
        // lesson.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
            <Container className="py-8">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <Link
                            href={`/instructor/courses/${courseId}`}
                            className="flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>
                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-2xl font-medium text-text-primary">
                                Lesson Setup
                            </h1>
                            <span className="text-sm text-text-secondary">
                                Module: {lesson.module.title}
                            </span>
                        </div>

                        <span className="text-sm text-text-secondary">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-x-2">
                        <Button
                            variant="outline"
                            disabled={!isComplete} // Add publish action later if we have lesson-level publishing
                        >
                            Publish Lesson (Auto-Saved)
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2 mb-4">
                            <div className="p-2 rounded-full bg-accent-cyan/10">
                                <LayoutDashboard className="h-5 w-5 text-accent-cyan" />
                            </div>
                            <h2 className="text-xl font-medium text-text-primary">
                                Customize your lesson
                            </h2>
                        </div>
                        <Card variant="default" className="bg-background-elevated">
                            <CardHeader>
                                <CardTitle>Lesson Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <LessonTitleForm
                                    initialData={lesson}
                                    courseId={courseId}
                                    lessonId={lessonId}
                                    moduleId={lesson.module.id}
                                />
                                <LessonDescriptionForm
                                    initialData={lesson}
                                    courseId={courseId}
                                    lessonId={lessonId}
                                    moduleId={lesson.module.id}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2 mb-4">
                                <div className="p-2 rounded-full bg-accent-purple/10">
                                    <Video className="h-5 w-5 text-accent-purple" />
                                </div>
                                <h2 className="text-xl font-medium text-text-primary">
                                    Add a video
                                </h2>
                            </div>
                            <Card variant="default" className="bg-background-elevated">
                                <CardContent className="pt-6">
                                    <LessonVideoForm
                                        initialData={lesson}
                                        courseId={courseId}
                                        lessonId={lessonId}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2 mb-4">
                                <div className="p-2 rounded-full bg-accent-purple/10">
                                    <Lock className="h-5 w-5 text-accent-purple" />
                                </div>
                                <h2 className="text-xl font-medium text-text-primary">
                                    Access Settings
                                </h2>
                            </div>
                            <Card variant="default" className="bg-background-elevated">
                                <CardContent className="pt-6">
                                    <LessonAccessForm
                                        initialData={lesson} // We probably need to add `isFree` to the schema first
                                        courseId={courseId}
                                        lessonId={lessonId}
                                        moduleId={lesson.module.id}
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
