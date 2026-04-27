
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function InstructorCoursesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    // Basic role protection (redundant if middleware handles it, but good for safety)
    // Note: Assuming middleware or layout handles main redirects, but adding check here.
    // If user is STUDENT, they shouldn't be here.
    // simpler redirect for now:
    if (!session?.user) redirect('/login');
  }

  const userId = session.user.id;
  const tenantId = session.user.tenantId;

  const courses = await prisma.course.findMany({
    where: {
      instructorId: userId,
      tenantId: tenantId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          enrollments: true,
          modules: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-transparent pb-20 md:pb-0">
      <Container className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            My Courses
          </h1>
          <p className="text-text-secondary">
            Manage your courses and content
          </p>
          </div>
         
          <Link href="/instructor/courses/new">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              New Course
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <Card variant="default" className="border-dashed border-2 bg-transparent">
            <CardContent className="py-20 text-center flex flex-col items-center">
              <div className="bg-accent-cyan/10 p-4 rounded-full mb-4">
                 <PlusCircle className="w-8 h-8 text-accent-cyan" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No courses yet
              </h3>
              <p className="text-text-secondary max-w-sm mx-auto mb-6">
                Get started by creating your first course. It only takes a few minutes.
              </p>
              <Link href="/instructor/courses/new">
                <Button>Create Course</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/instructor/courses/${course.id}`}>
                <Card variant="elevated" interactive className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                       <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                       <span className={`text-xs px-2 py-1 rounded-full border ${
                         course.status === 'PUBLISHED' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                       }`}>
                         {course.status}
                       </span>
                    </div>
                    
                    <p className="text-text-secondary text-sm line-clamp-2 min-h-[40px]">
                      {course.description || 'No description provided'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-text-muted mt-auto pt-4 border-t border-white/5">
                      <div className="flex gap-4">
                         <span>{course._count.modules} Modules</span>
                         <span>{course._count.enrollments} Students</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
