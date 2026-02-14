import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getCoursesByTenant } from '@/lib/db/queries/courses';
import { getEnrollmentsByUser } from '@/lib/db/queries/enrollments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default async function CoursesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const tenantId = session.user.tenantId;
  const userId = session.user.id;

  // Get all published courses
  const courses = await getCoursesByTenant(tenantId, 'PUBLISHED');
  
  // Get user enrollments
  const enrollments = await getEnrollmentsByUser(userId);
  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  // Separate enrolled and available courses
  const enrolledCourses = courses.filter((c) => enrolledCourseIds.has(c.id));
  const availableCourses = courses.filter((c) => !enrolledCourseIds.has(c.id));

  return (
    <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Courses
          </h1>
          <p className="text-text-secondary">
            Browse and enroll in courses
          </p>
        </div>

        {/* Search and Filter (placeholder for future) */}
        <div className="mb-8">
          <Input
            placeholder="Search courses..."
            className="max-w-md"
            disabled
          />
        </div>

        {/* Enrolled Courses */}
        {enrolledCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">
              My Enrolled Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => {
                const enrollment = enrollments.find((e) => e.courseId === course.id);
                return (
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
                      {enrollment && (
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
                      )}
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="outline" className="w-full">
                          {enrollment && enrollment.progress > 0
                            ? 'Continue Learning'
                            : 'Start Course'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Courses */}
        <div>
          <h2 className="text-2xl font-semibold text-text-primary mb-6">
            {enrolledCourses.length > 0 ? 'Available Courses' : 'All Courses'}
          </h2>
          {availableCourses.length === 0 ? (
            <Card variant="default">
              <CardContent className="py-12 text-center">
                <p className="text-text-secondary">
                  {courses.length === 0
                    ? 'No courses available yet.'
                    : 'You have enrolled in all available courses.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <Card key={course.id} variant="elevated" interactive>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription>
                      by {course.instructor.name} • {course._count.enrollments} students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                      {course.description || 'No description available'}
                    </p>
                    <div className="flex items-center text-sm text-text-secondary mb-4">
                      <span>{course._count.modules} modules</span>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                      <Button className="w-full">Enroll Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

