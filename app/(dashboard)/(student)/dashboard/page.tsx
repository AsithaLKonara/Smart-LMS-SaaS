import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { prisma } from '@/lib/db/prisma';
import { getEnrollmentsByUser } from '@/lib/db/queries/enrollments';
import { getCoursesByTenant } from '@/lib/db/queries/courses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Video, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Activity, 
  Trophy,
  Sparkles,
  BookOpen,
  Search,
  ChevronRight
} from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { getStreak, getBadges } from '@/lib/db/queries/gamification';
import { StreakCounter } from '@/components/features/gamification/StreakCounter';
import { BadgeList } from '@/components/features/gamification/BadgeList';
import { EmptyState } from '@/components/ui/EmptyState';
import { KPIStrip } from '@/components/dashboard/KPIStrip';
import { TextGradient } from '@/components/ui/TextGradient';
import { getTenantFromHost } from '@/lib/auth/utils';
import { getTenantBySubdomain } from '@/lib/db/queries/tenants';

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = session.user.role;
  if (!role) {
    redirect('/login');
  }

  const userId = session.user.id;
  
  // Multi-Tenant Context Detection
  const subdomain = await getTenantFromHost();
  const currentInstitute = subdomain ? await getTenantBySubdomain(subdomain) : null;
  const isGlobalMode = !subdomain;

  const streak = await getStreak(userId);
  const badges = await getBadges(userId);

  const upcomingClasses = await prisma.liveClass.findMany({
    where: {
      course: { 
        enrollments: { some: { userId } },
        ...(currentInstitute ? { tenantId: currentInstitute.id } : {})
      },
      scheduledAt: { gte: new Date() }
    },
    include: { 
        course: { 
            select: { title: true, id: true, tenant: { select: { subdomain: true } } } 
        } 
    },
    orderBy: { scheduledAt: 'asc' },
    take: 3
  });

  // Get user's enrollments (Global)
  const allEnrollments = await getEnrollmentsByUser(userId);

  // Scoped enrollments based on mode
  const enrollments = isGlobalMode 
    ? allEnrollments 
    : allEnrollments.filter(e => e.course.tenantId === currentInstitute?.id);
  
  const otherEnrollments = !isGlobalMode 
    ? allEnrollments.filter(e => e.course.tenantId !== currentInstitute?.id)
    : [];

  // Get available courses (scoped to current tenant if on subdomain)
  const availableCourses = currentInstitute 
    ? await getCoursesByTenant(currentInstitute.id, 'PUBLISHED')
    : [];

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

  const getTenantUrl = (subdomain: string | null, path: string = '') => {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
    const protocol = rootDomain.includes('localhost') ? 'http' : 'https';
    if (!subdomain) return `${protocol}://${rootDomain}${path}`;
    return `${protocol}://${subdomain}.${rootDomain}${path}`;
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 md:pb-0">
      <div className="flex flex-col gap-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <FadeIn
            direction="right"
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 rounded bg-accent-cyan/10 border border-accent-cyan/20 text-[10px] font-bold text-accent-cyan uppercase tracking-widest">
                    {isGlobalMode ? 'Global Learning Ecosystem' : `${currentInstitute?.name} Portal`}
                </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary font-heading tracking-tight">
              {isGlobalMode ? 'Your' : 'Welcome to'} <TextGradient>{isGlobalMode ? 'Learning Universe' : currentInstitute?.name}</TextGradient>
            </h1>
            <p className="text-text-secondary text-lg">
              {isGlobalMode 
                ? `Hello ${session.user.name}, explore all your courses across every institute in one place.` 
                : `Pick up where you left off at ${currentInstitute?.name}.`}
            </p>
          </FadeIn>
          <div className="flex items-center gap-4">
            <StreakCounter count={streak?.currentStreak || 0} />
            {!isGlobalMode && (
                <Link href={getTenantUrl(null, '/dashboard')}>
                    <Button variant="glass" size="sm" className="hidden md:flex">
                        Global View
                    </Button>
                </Link>
            )}
          </div>
        </div>

        {/* KPI Stats */}
        <KPIStrip items={[
          {
            label: 'In Progress',
            value: coursesInProgress,
            icon: <Activity className="w-6 h-6" />,
            color: 'cyan',
            change: { value: '+2 this week', trend: 'up' }
          },
          {
            label: 'Completed',
            value: completedCourses,
            icon: <Trophy className="w-6 h-6" />,
            color: 'purple'
          },
          {
            label: 'Avg. Progress',
            value: `${Math.round(totalProgress)}%`,
            icon: <GraduationCap className="w-6 h-6" />,
            color: 'green',
            change: { value: 'Steady', trend: 'up' }
          },
          {
            label: 'Study Time',
            value: formatStudyTime(totalStudySeconds),
            icon: <Clock className="w-6 h-6" />,
            color: 'orange'
          }
        ]} />

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


        {/* My Courses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">
                {isGlobalMode ? 'All My Courses' : 'Courses at this Institute'}
            </h2>
            <Link href="/courses">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Your learning shelf is empty"
              description={isGlobalMode ? "Start your journey by exploring our global institutes." : "Browse our catalog to find your first course at this institute."}
              actionLabel={isGlobalMode ? "Explore Institutes" : "Explore Catalog"}
              actionHref={isGlobalMode ? "/institutes" : "/courses"}
              className="py-16"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.slice(0, 6).map((enrollment) => (
                <Card key={enrollment.id} variant="elevated" interactive>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                        {isGlobalMode && (
                            <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-text-muted uppercase tracking-tighter">
                                {enrollment.course.tenant.name}
                            </div>
                        )}
                    </div>
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
                    <Link href={getTenantUrl(enrollment.course.tenant.subdomain, `/courses/${enrollment.course.id}`)}>
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

        {/* Other Institutes Section (only in Subdomain Mode) */}
        {!isGlobalMode && otherEnrollments.length > 0 && (
            <div className="mb-8 p-8 rounded-3xl glass border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Your other Schools</h2>
                        <p className="text-sm text-text-secondary">Quick access to your learning in other institutes</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from(new Set(otherEnrollments.map(e => e.course.tenant.id))).map(tId => {
                        const tenant = otherEnrollments.find(e => e.course.tenant.id === tId)?.course.tenant;
                        const count = otherEnrollments.filter(e => e.course.tenant.id === tId).length;
                        return (
                            <Link key={tId} href={getTenantUrl(tenant?.subdomain || null, '/dashboard')}>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-purple/30 transition-all flex items-center justify-between group">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-text-primary group-hover:text-accent-purple transition-colors">{tenant?.name}</span>
                                        <span className="text-[10px] text-text-muted">{count} active {count === 1 ? 'course' : 'courses'}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-purple" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        )}

        {!isGlobalMode && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-text-primary">Available Courses at {currentInstitute?.name}</h2>
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
        )}
        {/* Achievements Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-accent-purple" />
            <h2 className="text-2xl font-semibold text-text-primary">My Achievements</h2>
          </div>
          <BadgeList badges={badges} />
        </div>
      </div>
    </div>
  );
}
