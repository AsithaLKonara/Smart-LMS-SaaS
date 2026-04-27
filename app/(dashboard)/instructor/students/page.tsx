
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getStudentsByInstructor } from "@/lib/db/queries/users";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { format } from "date-fns";

export default async function InstructorStudentsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return redirect("/");
    }

    const students = await getStudentsByInstructor(userId);

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0">
            <Container className="py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary">My Students</h1>
                    <div className="text-sm text-text-secondary">
                        Total Students: <span className="text-accent-cyan font-bold">{students.length}</span>
                    </div>
                </div>

                <Card variant="elevated">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Enrolled Courses</th>
                                        <th className="px-6 py-4">Avg. Progress</th>
                                        <th className="px-6 py-4">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {students.map((student) => {
                                        const avgProgress = student.enrollments.reduce((acc, curr) => acc + curr.progress, 0) / (student.enrollments.length || 1);

                                        return (
                                            <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple font-bold">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-text-primary">{student.name}</p>
                                                            <p className="text-xs text-text-secondary">{student.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {student.enrollments.map((enr) => (
                                                            <span key={enr.course.id} className="text-[10px] bg-background-secondary px-2 py-0.5 rounded border border-white/10 text-text-secondary">
                                                                {enr.course.title}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-16 bg-background-secondary rounded-full overflow-hidden border border-white/5">
                                                            <div
                                                                className="h-full bg-accent-cyan"
                                                                style={{ width: `${avgProgress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-text-primary font-medium">
                                                            {Math.round(avgProgress)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-text-secondary">
                                                    {format(new Date(student.createdAt), "MMM dd, yyyy")}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {students.length === 0 && (
                                <div className="p-12 text-center text-text-secondary">
                                    No students enrolled yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}
