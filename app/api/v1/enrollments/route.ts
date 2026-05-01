
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

async function validateApiKey() {
    const headerList = await headers();
    const apiKey = headerList.get("x-api-key");

    if (!apiKey) return null;

    // In a real app, hash the incoming key before comparison
    const keyData = await prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: { tenant: true }
    });

    if (!keyData || (keyData.expiresAt && keyData.expiresAt < new Date())) {
        return null;
    }

    return keyData;
}

export async function POST(req: Request) {
    const keyData = await validateApiKey();
    if (!keyData) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { email, courseId } = await req.json();

        // Find or create user
        let user = await prisma.user.findFirst({
            where: { email, tenantId: keyData.tenantId }
        });

        if (!user) {
            // Enterprise auto-provisioning
            user = await prisma.user.create({
                data: {
                    email,
                    name: email.split('@')[0],
                    password: 'ENTERPRISE_SSO', // Placeholder
                    tenantId: keyData.tenantId,
                    role: 'STUDENT'
                }
            });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: user.id,
                courseId,
            }
        });

        return NextResponse.json({ success: true, enrollmentId: enrollment.id });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
