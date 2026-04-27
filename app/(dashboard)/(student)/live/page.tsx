
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calendar, Video, Clock } from "lucide-react";
import { format, isFuture, isPast, addMinutes, subMinutes } from "date-fns";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function StudentLiveClassesPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return redirect("/");
    }

    const liveClasses = await prisma.liveClass.findMany({
        where: {
            course: {
                enrollments: {
                    some: {
                        userId: userId,
                    },
                },
            },
            scheduledAt: {
                gte: new Date(), // Only upcoming or currently happening (if we adjust this logic)
            }
            // Actually, we should show recent past classes too maybe? Or just future.
            // Let's filter slightly in the past to catch ongoing ones.
            // scheduledAt >= now - duration (approx).
        },
        include: {
            course: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: {
            scheduledAt: "asc",
        },
    });

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0">
            <Container className="py-8">
                <div className="flex flex-col gap-y-2 mb-8">
                    <h1 className="text-2xl font-medium text-text-primary">
                        Upcoming Live Classes
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Join scheduled sessions for your enrolled courses.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveClasses.length === 0 && (
                        <div className="col-span-full text-center text-text-secondary mt-10">
                            No upcoming live classes scheduled.
                        </div>
                    )}

                    {liveClasses.map((liveClass) => {
                        const now = new Date();
                        const startValid = subMinutes(new Date(liveClass.scheduledAt), 10); // Check if within 10 mins before start
                        const isJoinable = isPast(startValid); // If now > startValid (i.e., less than 10 mins to start or started)

                        return (
                            <Card key={liveClass.id} variant="default" className="bg-background-elevated border-white/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-medium">
                                        {liveClass.title}
                                    </CardTitle>
                                    <Video className="h-4 w-4 text-accent-cyan" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-text-secondary mb-4">
                                        {liveClass.course.title}
                                    </div>
                                    <div className="flex items-center text-sm text-text-secondary mb-2">
                                        <Calendar className="mr-2 h-4 w-4 text-accent-cyan" />
                                        {format(new Date(liveClass.scheduledAt), "PPP")}
                                    </div>
                                    <div className="flex items-center text-sm text-text-secondary mb-4">
                                        <Clock className="mr-2 h-4 w-4 text-accent-cyan" />
                                        {format(new Date(liveClass.scheduledAt), "p")} ({liveClass.duration} mins)
                                    </div>

                                    <a
                                        href={liveClass.meetingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={isJoinable ? "" : "pointer-events-none"}
                                    >
                                        <Button className="w-full" disabled={!isJoinable}>
                                            {isJoinable ? "Join Now" : "Starts Soon"}
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </Container>
        </div>
    );
}
