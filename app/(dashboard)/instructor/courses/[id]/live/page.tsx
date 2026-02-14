
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Platform } from "@prisma/client";

// Import Delete action wrapper component (to be created)
import { LiveClassActions } from "./_components/LiveClassActions";

export default async function LiveClassesPage({
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
            liveClasses: {
                orderBy: {
                    scheduledAt: "asc",
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
                        <h1 className="text-2xl font-medium text-text-primary">
                            Live Classes for {course.title}
                        </h1>
                    </div>
                    <Link href={`/instructor/courses/${courseId}/live/new`}>
                        <Button>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Schedule Class
                        </Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    {course.liveClasses.length === 0 && (
                        <div className="text-center text-sm text-text-secondary mt-10">
                            No live classes scheduled yet.
                        </div>
                    )}
                    {course.liveClasses.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border border-white/10 rounded-md bg-background-elevated"
                        >
                            <div className="flex items-center gap-x-4">
                                <div className="p-2 rounded-full bg-accent-purple/10">
                                    <Calendar className="h-6 w-6 text-accent-purple" />
                                </div>
                                <div>
                                    <h3 className="text-text-primary font-medium">{item.title}</h3>
                                    <div className="text-sm text-text-secondary flex gap-x-2">
                                        <span>{format(new Date(item.scheduledAt), "PPP p")}</span>
                                        <span>•</span>
                                        <span>{item.duration} mins</span>
                                        <span>•</span>
                                        <span className="capitalize">{item.platform.toLowerCase().replace("_", " ")}</span>
                                    </div>
                                    <a
                                        href={item.meetingUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-accent-cyan hover:underline mt-1 block"
                                    >
                                        Join Link
                                    </a>
                                </div>
                            </div>
                            {/* Actions Component (Delete/Edit) */}
                            <LiveClassActions liveClassId={item.id} courseId={courseId} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
