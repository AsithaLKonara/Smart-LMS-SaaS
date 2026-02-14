import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getEnrollmentsByUser } from '@/lib/db/queries/enrollments';
import { getCoursesByTenant } from '@/lib/db/queries/courses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { prisma } from '@/lib/db/prisma';
import { Video, Calendar, Sparkles, BookOpen, Search, Clock, GraduationCap } from 'lucide-react';
import { getStreak, getBadges } from '@/lib/db/queries/gamification';
import { StreakCounter } from '@/components/features/gamification/StreakCounter';
import { BadgeList } from '@/components/features/gamification/BadgeList';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userId = session.user.id;
  const tenantId = session.user.tenantId;

  const streak = await getStreak(userId);
  const badges = await getBadges(userId);

  const upcomingClasses = await prisma.liveClass.findMany({
    where: {
      course: { enrollments: { some: { userId } } },
      scheduledAt: { gte: new Date() }
    },
    include: { course: { select: { title: true, id: true } } },
    orderBy: { scheduledAt: 'asc' },
    take: 3
  });

  // Get user's enrollments
  const enrollments = await getEnrollmentsByUser(userId);

  // Get available courses (published)
  const availableCourses = await getCoursesByTenant(tenantId, 'PUBLISHED');

  // Get last accessed course/lesson
  const lastEnrollment = enrollments[0];
  const continueLearning = lastEnrollment
    ? {
      course: lastEnrollment.course,
      progress: lastEnrollment.progress,
      enrollmentId: lastEnrollment.id,
    }
    : null;

  // Calculate stats
  const coursesInProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
  const completedCourses = enrollments.filter((e) => e.completedAt).length;
  const totalProgress = enrollments.length > 0
    ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
    : 0;

  // Calculate total study time
  const totalStudySeconds = enrollments.reduce((sum, e) => {
    const lessonTime = e.lessonProgress?.reduce((lSum, lp) => lSum + (lp.timeSpent || 0), 0) || 0;
    return sum + lessonTime;
  }, 0);

  const formatStudyTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
      <Container className="py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              Welcome back, {session.user.name}!
            </h1>
            <p className="text-text-secondary">
              Continue your learning journey
            </p>
          </div>
          <StreakCounter count={streak?.currentStreak || 0} />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary flex items-center gap-x-2">
              <Video className="h-5 w-5 text-red-500" />
              Upcoming Live Classes
            </h2>
            <Link href="/live" className="text-sm text-accent-cyan hover:underline">
              View All
            </Link>
          </div>
          {upcomingClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingClasses.map(cls => (
                <Card key={cls.id} variant="elevated" className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <p className="font-medium text-text-primary truncate">{cls.title}</p>
                    <p className="text-xs text-text-secondary mb-2 truncate">{cls.course.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-text-muted gap-x-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(cls.scheduledAt), "MMM d, h:mm a")}
                      </div>
                      <Link href={cls.meetingUrl} target="_blank">
                        <Button size="sm" variant="outline" className="h-7 text-xs px-2">Join</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No sessions scheduled"
              description="Keep an eye on your calendar or check with your instructors for upcoming live sessions."
              className="py-12 bg-white/[0.02]"
            />
          )}
        </div>

        {/* Continue Learning Card */}
        {continueLearning && (
          <Card variant="elevated" className="mb-8">
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {continueLearning.course.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {continueLearning.course.description || 'No description available'}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-text-secondary mb-2">
                      <span>Progress</span>
                      <span>{Math.round(continueLearning.progress)}%</span>
                    </div>
                    <div className="w-full bg-background-secondary rounded-full h-2">
                      <div
                        className="bg-accent-cyan h-2 rounded-full transition-all"
                        style={{ width: `${continueLearning.progress}%` }}
                      />
                    </div>
                  </div>
                  <Link href={`/courses/${continueLearning.course.id}`}>
                    <Button className="w-full md:w-auto">Continue Course</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Courses in Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent-cyan">{coursesInProgress}</div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Completed Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent-purple">{completedCourses}</div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">
                {Math.round(totalProgress)}%
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Total Study Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent-cyan">
                {formatStudyTime(totalStudySeconds)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">My Courses</h2>
            <Link href="/courses">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Your learning shelf is empty"
              description="Browse our catalog to find your first course and start learning today."
              actionLabel="Explore Catalog"
              actionHref="/courses"
              className="py-16"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.slice(0, 6).map((enrollment) => (
                <Card key={enrollment.id} variant="elevated" interactive>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{enrollment.course.title}</CardTitle>
                    <CardDescription>
                      by {enrollment.course.instructor.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-text-secondary mb-2">
                        <span>Progress</span>
                        <span>{Math.round(enrollment.progress)}%</span>
                      </div>
                      <div className="w-full bg-background-secondary rounded-full h-2">
                        <div
                          className="bg-accent-cyan h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                    <Link href={`/courses/${enrollment.course.id}`}>
                      <Button variant="outline" className="w-full">
                        {enrollment.progress > 0 ? 'Continue' : 'Start Course'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">Available Courses</h2>
            <Link href="/courses">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          {availableCourses.filter(c => !enrollments.some(e => e.courseId === c.id)).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses
                .filter(c => !enrollments.some(e => e.courseId === c.id))
                .slice(0, 3)
                .map((course) => (
                  <Card key={course.id} variant="elevated" interactive>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                      <CardDescription>
                        by {course.instructor.name} • {course._count.enrollments} students
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                        {course.description || 'No description available'}
                      </p>
                      <Link href={`/courses/${course.id}`}>
                        <Button className="w-full">Enroll Now</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No new courses"
              description="You've enrolled in all currently available courses or there are no new courses at the moment."
              className="py-16 bg-white/[0.02]"
            />
          )}
        </div>
        {/* Achievements Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-accent-purple" />
            <h2 className="text-2xl font-semibold text-text-primary">My Achievements</h2>
          </div>
          <BadgeList badges={badges as any} />
        </div>
      </Container>
    </div>
  );
}

