import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const onboardingSchema = z.object({
    logo: z.string().optional(),
    accentColor: z.string().optional(),
    teamInvites: z.string().optional(),
    importSample: z.boolean().optional(),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ tenantId: string }> }
) {
    try {
        const body = await request.json();
        const validatedData = onboardingSchema.parse(body);
        const { tenantId } = await params;

        // Update tenant configuration
        await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                logo: validatedData.logo || null,
                accentColor: validatedData.accentColor || '#22D3EE',
                onboardingCompleted: true,
            },
        });

        // Handle sample content import if requested
        if (validatedData.importSample) {
            // In a real app, you'd trigger a seeding service here
            console.log(`[Onboarding] Seeding sample content for tenant: ${tenantId}`);
            // Mock seeding: we could create a dummy course
            const admin = await prisma.user.findFirst({
                where: { tenantId, role: 'ADMIN' }
            });

            if (admin) {
                await prisma.course.create({
                    data: {
                        title: 'Getting Started with SmartLMS',
                        description: 'Learn how to master your new academy platform with these best practices.',
                        status: 'PUBLISHED',
                        tenantId,
                        instructorId: admin.id,
                    }
                });
            }
        }

        // Handle team invites (Mock)
        if (validatedData.teamInvites) {
            const emails = validatedData.teamInvites.split(',').map(e => e.trim()).filter(Boolean);
            console.log(`[Onboarding] Sending invites to: ${emails.join(', ')}`);
            // Real implementation would create Invitation records and send emails
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Onboarding completion failed' },
            { status: 500 }
        );
    }
}
