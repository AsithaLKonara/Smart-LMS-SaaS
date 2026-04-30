import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getStudentsByInstructor } from "@/lib/db/queries/users";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/layout/Container";
import { StudentTable } from "@/components/features/students/StudentTable";

export default async function InstructorStudentsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return redirect("/");
    }

    const students = await getStudentsByInstructor(userId);
    const courses = await prisma.course.findMany({
        where: { instructorId: userId, tenantId: session.user.tenantId },
        select: { id: true, title: true }
    });

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0">
            <Container className="py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary">My Students</h1>
                    <div className="text-sm text-text-secondary">
                        Total Students: <span className="text-accent-cyan font-bold">{students.length}</span>
                    </div>
                </div>

                <StudentTable students={students} courses={courses} />
            </Container>
        </div>
    );
}
