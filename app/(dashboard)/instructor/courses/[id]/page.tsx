
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ArrowLeft, LayoutDashboard, ListChecks, Video } from 'lucide-react';
import Link from 'next/link';

import { TitleForm } from './_components/TitleForm';
import { DescriptionForm } from './_components/DescriptionForm';
import { ModulesForm } from './_components/ModulesForm';
import { PublicationControls } from './_components/PublicationControls';
import { AIOutlineGenerator } from '@/components/features/ai/AIOutlineGenerator';

export default async function CourseIdPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await auth();

    if (!session?.user) {
        return redirect('/login');
    }

    const { id } = await params;
    const userId = session.user.id;

    const course = await prisma.course.findUnique({
        where: {
            id: id,
            instructorId: userId
        },
        include: {
            modules: {
                orderBy: {
                    order: 'asc',
                },
                include: {
                    lessons: {
                        orderBy: {
                            order: 'asc',
                        }
                    }
                }
            }
        }
    });

    if (!course) {
        return redirect('/instructor/courses');
    }

    const requiredFields = [
        course.title,
        course.description,
        course.thumbnail,
        course.modules.some(module => module.lessons.length > 0)
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
                            href="/instructor/courses"
                            className="flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to courses
                        </Link>
                        <h1 className="text-2xl font-medium text-text-primary">
                            Course Setup
                        </h1>
                        <span className="text-sm text-text-secondary">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-x-2">
                        <AIOutlineGenerator courseId={course.id} />
                        <div className="flex items-center gap-x-2">
                            <PublicationControls
                                courseId={course.id}
                                isPublished={course.status === "PUBLISHED"}
                                disabled={!isComplete}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <div className="p-2 rounded-full bg-accent-cyan/10">
                                <LayoutDashboard className="h-5 w-5 text-accent-cyan" />
                            </div>
                            <h2 className="text-xl font-medium text-text-primary">
                                Customize your course
                            </h2>
                        </div>

                        <Card variant="default" className="bg-background-elevated">
                            <CardHeader>
                                <CardTitle>Course Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <TitleForm initialData={course} courseId={course.id} />
                                <DescriptionForm initialData={course} courseId={course.id} />
                                {/* <ImageForm ... /> */}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2 mb-4">
                                <div className="p-2 rounded-full bg-accent-purple/10">
                                    <ListChecks className="h-5 w-5 text-accent-purple" />
                                </div>
                                <h2 className="text-xl font-medium text-text-primary">
                                    Course Modules & Lessons
                                </h2>
                            </div>

                            <Card variant="default" className="bg-background-elevated">
                                <CardContent className="pt-6">
                                    <ModulesForm initialData={course} courseId={course.id} />
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <div className="flex items-center gap-x-2 mb-4">
                                <div className="p-2 rounded-full bg-accent-cyan/10">
                                    <Video className="h-5 w-5 text-accent-cyan" />
                                </div>
                                <h2 className="text-xl font-medium text-text-primary">
                                    Assessments & Live
                                </h2>
                            </div>

                            <Card variant="default" className="bg-background-elevated">
                                <CardContent className="p-6 space-y-4">
                                    <Link
                                        href={`/instructor/courses/${course.id}/live`}
                                        className="flex items-center justify-between p-3 border border-white/10 rounded-md hover:bg-background-secondary transition-colors group"
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <Video className="h-4 w-4 text-accent-cyan" />
                                            <span className="text-sm font-medium text-text-primary">Live Classes</span>
                                        </div>
                                        <ArrowLeft className="h-4 w-4 rotate-180 text-text-secondary group-hover:text-text-primary transition-colors" />
                                    </Link>
                                    <Link
                                        href={`/instructor/courses/${course.id}/exams`}
                                        className="flex items-center justify-between p-3 border border-white/10 rounded-md hover:bg-background-secondary transition-colors group"
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <ListChecks className="h-4 w-4 text-accent-purple" />
                                            <span className="text-sm font-medium text-text-primary">Exams</span>
                                        </div>
                                        <ArrowLeft className="h-4 w-4 rotate-180 text-text-secondary group-hover:text-text-primary transition-colors" />
                                    </Link>
                                    <Link
                                        href={`/instructor/courses/${course.id}/assignments`}
                                        className="flex items-center justify-between p-3 border border-white/10 rounded-md hover:bg-background-secondary transition-colors group"
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <LayoutDashboard className="h-4 w-4 text-green-400" />
                                            <span className="text-sm font-medium text-text-primary">Assignments</span>
                                        </div>
                                        <ArrowLeft className="h-4 w-4 rotate-180 text-text-secondary group-hover:text-text-primary transition-colors" />
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
