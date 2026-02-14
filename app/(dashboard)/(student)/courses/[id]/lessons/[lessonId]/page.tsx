import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getCourseById } from '@/lib/db/queries/courses';
import { getEnrollment } from '@/lib/db/queries/enrollments';
import { updateLessonProgress, updateEnrollmentProgress } from '@/lib/db/queries/enrollments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { MarkLessonCompleteButton } from '@/components/features/MarkLessonCompleteButton';
import { SummarizeButton } from '@/components/features/ai/SummarizeButton';
import { AIQuizGenerator } from '@/components/features/ai/AIQuizGenerator';
import { HeartbeatTrigger } from '@/components/features/HeartbeatTrigger';
import { Preview } from '@/components/ui/Preview';

interface LessonPageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { id: courseId, lessonId } = await params;
  const tenantId = session.user.tenantId;
  const userId = session.user.id;

  const course = await getCourseById(courseId, tenantId);

  if (!course) {
    redirect('/courses');
  }

  const enrollment = await getEnrollment(userId, courseId);

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  // Find the lesson
  const lesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === lessonId);

  if (!lesson) {
    redirect(`/courses/${courseId}`);
  }

  // Get lesson progress
  const lessonProgress = enrollment.lessonProgress.find(
    (lp) => lp.lesson.id === lessonId
  );

  // Find previous and next lessons
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
      <Container className="py-8">
        <HeartbeatTrigger enrollmentId={enrollment.id} lessonId={lesson.id} />
        <div className="mb-6">
          <Link
            href={`/courses/${courseId}`}
            className="text-accent-cyan hover:text-accent-cyan/80 transition-colors mb-4 inline-block"
          >
            ← Back to Course
          </Link>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-text-primary mr-2">{lesson.title}</h1>
            <div className="flex items-center gap-2">
              <SummarizeButton lessonId={lesson.id} />
              <AIQuizGenerator lessonId={lesson.id} />
            </div>
          </div>
          <p className="text-text-secondary">
            {course.title} • Module {course.modules.findIndex((m) =>
              m.lessons.some((l) => l.id === lessonId)
            ) + 1}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {lesson.videoUrl && (
              <Card variant="elevated">
                <CardContent className="p-0">
                  <div className="aspect-video bg-background-secondary rounded-t-lg overflow-hidden">
                    {lesson.videoUrl.includes('youtube.com') ||
                      lesson.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={lesson.videoUrl.replace(
                          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
                          'https://www.youtube.com/embed/$1'
                        )}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={lesson.videoUrl}
                        controls
                        className="w-full h-full"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}



            {/* Lesson Content */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
              </CardHeader>
              <CardContent>
                {lesson.content ? (
                  <Preview value={lesson.content} />
                ) : (
                  <p className="text-text-secondary">No content available for this lesson.</p>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              {previousLesson ? (
                <Link href={`/courses/${courseId}/lessons/${previousLesson.id}`}>
                  <Button variant="outline">← Previous Lesson</Button>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                  <Button>Next Lesson →</Button>
                </Link>
              ) : (
                <MarkLessonCompleteButton
                  enrollmentId={enrollment.id}
                  lessonId={lessonId}
                  isCompleted={lessonProgress?.completed || false}
                />
              )}
            </div>
          </div>

          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1">
            <Card variant="elevated" className="sticky top-8">
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="mb-4">
                      <h4 className="text-sm font-semibold text-text-primary mb-2">
                        Module {moduleIndex + 1}: {module.title}
                      </h4>
                      <div className="space-y-1 ml-2">
                        {module.lessons.map((l) => {
                          const lp = enrollment.lessonProgress.find(
                            (progress) => progress.lesson.id === l.id
                          );
                          const isCurrent = l.id === lessonId;
                          const isCompleted = lp?.completed || false;

                          return (
                            <Link
                              key={l.id}
                              href={`/courses/${courseId}/lessons/${l.id}`}
                              className={`block p-2 rounded text-sm transition-colors ${isCurrent
                                ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                                : 'text-text-secondary hover:bg-background-card hover:text-text-primary'
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{l.title}</span>
                                {isCompleted && (
                                  <span className="text-accent-cyan">✓</span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

