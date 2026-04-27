import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getCourseById } from '@/lib/db/queries/courses';
import { getEnrollment } from '@/lib/db/queries/enrollments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import Link from 'next/link';
import { Calendar, Video, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { EnrollButton } from '@/components/features/EnrollButton';
import { getPrerequisiteMapForCourse, getResumeLessonId, isLessonUnlocked } from '@/lib/db/queries/learning';

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;
  const tenantId = session.user.tenantId;
  const userId = session.user.id;

  const course = await getCourseById(id, tenantId);

  if (!course) {
    redirect('/courses');
  }

  const enrollment = await getEnrollment(userId, id);
  const isEnrolled = !!enrollment;

  // Calculate total lessons
  const totalLessons = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );

  const orderedLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const prereqMap = await getPrerequisiteMapForCourse(id);
  const completedLessonIds = new Set(
    (enrollment?.lessonProgress ?? []).filter((lp) => lp.completed).map((lp) => lp.lesson.id)
  );
  const resumeLessonId =
    enrollment &&
    getResumeLessonId(orderedLessonIds, prereqMap, completedLessonIds);
  const primaryCtaLessonId =
    resumeLessonId ?? course.modules[0]?.lessons[0]?.id ?? '';

  return (
    <div className="min-h-screen bg-transparent pb-20 md:pb-0">
      <Container className="py-8">
        <div className="mb-8">
          <Link
            href="/courses"
            className="text-accent-cyan hover:text-accent-cyan/80 transition-colors mb-4 inline-block"
          >
            ← Back to Courses
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 font-heading">
            {course.title}
          </h1>
          <p className="text-text-secondary">
            by {course.instructor.name} • {course._count.enrollments} students
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="glass" className="glass-hover">
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary whitespace-pre-line">
                  {course.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>

            {/* Live Classes (if any) */}
            {course.liveClasses && course.liveClasses.length > 0 && (
              <Card variant="glass" className="glass-hover">
                <CardHeader>
                  <CardTitle>Live Sessions</CardTitle>
                  <CardDescription>
                    Upcoming live classes for this course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.liveClasses.map((liveClass) => (
                      <div key={liveClass.id} className="flex items-center justify-between p-3 rounded-lg glass border-white/10 glass-hover">
                        <div className="flex items-center gap-x-3">
                          <div className="p-2 rounded-full bg-accent-purple/10">
                            <Video className="h-4 w-4 text-accent-purple" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary text-sm">{liveClass.title}</p>
                            <p className="text-xs text-text-muted flex items-center gap-x-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(liveClass.scheduledAt), "PPP p")}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={liveClass.meetingUrl} target="_blank" rel="noreferrer">
                            Join
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assignments (if any) */}
            {course.assignments && course.assignments.length > 0 && (
              <Card variant="glass" className="glass-hover">
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                  <CardDescription>
                    Pending assignments to complete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg glass border-white/10 glass-hover">
                        <div className="flex items-center gap-x-3">
                          <div className="p-2 rounded-full bg-green-500/10">
                            <ClipboardList className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary text-sm">{assignment.title}</p>
                            {assignment.dueDate && (
                              <p className="text-xs text-text-muted flex items-center gap-x-1">
                                <Calendar className="h-3 w-3" />
                                Due: {format(new Date(assignment.dueDate), "PPP")}
                              </p>
                            )}
                          </div>
                        </div>
                        <Link href={isEnrolled ? `/courses/${course.id}/assignments/${assignment.id}` : "#"}>
                          <Button size="sm" variant="outline" disabled={!isEnrolled}>
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Modules */}
            <Card variant="glass" className="glass-hover">
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.modules.length} modules • {totalLessons} lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                      <h3 className="text-lg font-semibold text-text-primary mb-3 font-heading">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      <div className="space-y-2 ml-4">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const lessonProgress = enrollment?.lessonProgress.find(
                            (lp) => lp.lesson.id === lesson.id
                          );
                          const isCompleted = lessonProgress?.completed || false;
                          const unlocked =
                            !isEnrolled ||
                            isLessonUnlocked(lesson.id, prereqMap, completedLessonIds);

                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-2 rounded-lg glass-light border-white/5 hover:border-white/10 transition-colors glass-hover"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-text-muted text-sm">
                                  {moduleIndex + 1}.{lessonIndex + 1}
                                </span>
                                {unlocked ? (
                                  <Link
                                    href={`/courses/${id}/lessons/${lesson.id}`}
                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                  >
                                    {lesson.title}
                                  </Link>
                                ) : (
                                  <span className="text-text-muted cursor-not-allowed" title="Complete prerequisites first">
                                    {lesson.title} (locked)
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="text-accent-cyan text-sm">✓</span>
                                )}
                              </div>
                              {lesson.duration && (
                                <span className="text-text-muted text-sm">
                                  {Math.floor(lesson.duration / 60)}:
                                  {String(lesson.duration % 60).padStart(2, '0')}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="glass-dark" className="sticky top-8 glass-hover">
              <CardHeader>
                <CardTitle>Course Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Instructor</p>
                  <p className="text-text-primary font-medium">
                    {course.instructor.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary mb-1">Students</p>
                  <p className="text-text-primary font-medium">
                    {course._count.enrollments} enrolled
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary mb-1">Content</p>
                  <p className="text-text-primary font-medium">
                    {course.modules.length} modules, {totalLessons} lessons
                  </p>
                </div>

                {isEnrolled && enrollment && (
                  <div>
                    <p className="text-sm text-text-secondary mb-2">Your Progress</p>
                    <div className="w-full bg-background-secondary rounded-full h-2 mb-2">
                      <div
                        className="bg-accent-cyan h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-text-primary">
                      {Math.round(enrollment.progress)}% Complete
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  {isEnrolled ? (
                    <Link href={primaryCtaLessonId ? `/courses/${id}/lessons/${primaryCtaLessonId}` : `#`}>
                      <Button className="w-full" size="lg" disabled={!primaryCtaLessonId}>
                        {enrollment && enrollment.progress > 0
                          ? 'Continue Learning'
                          : 'Start Course'}
                      </Button>
                    </Link>
                  ) : (
                    <EnrollButton courseId={id} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

