
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { apiResponse, apiError, handleApiError } from "@/lib/api/response";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return apiError("Unauthorized", 401);
        }

        const userId = session.user.id;
        const tenantId = session.user.tenantId;

        const now = new Date();
        const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

        // Find upcoming live classes for courses the student is enrolled in
        const upcomingClasses = await prisma.liveClass.findMany({
            where: {
                course: {
                    tenantId: tenantId,
                    enrollments: {
                        some: {
                            userId: userId
                        }
                    }
                },
                scheduledAt: {
                    gt: new Date(now.getTime() - 10 * 60 * 1000), // Show if started up to 10 mins ago
                    lt: thirtyMinutesFromNow
                }
            },
            orderBy: {
                scheduledAt: 'asc'
            }
        });

        return apiResponse(upcomingClasses);
    } catch (error) {
        return handleApiError(error);
    }
}
