import { NextRequest, NextResponse } from 'next/server';
import { createTenant, isSubdomainAvailable } from '@/lib/db/queries/tenants';
import { z } from 'zod';

const createTenantSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  subdomain: z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(63, 'Subdomain must be less than 63 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
  plan: z.enum(['FREE', 'PRO', 'ENTERPRISE']).optional(),
  accentColor: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTenantSchema.parse(body);

    // Check if subdomain is available
    const available = await isSubdomainAvailable(validatedData.subdomain);
    if (!available) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subdomain is already taken',
        },
        { status: 400 }
      );
    }

    const tenant = await createTenant({
      name: validatedData.name,
      subdomain: validatedData.subdomain,
      plan: validatedData.plan || 'FREE',
      accentColor: validatedData.accentColor,
    });

    return NextResponse.json(
      {
        success: true,
        tenant,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create tenant',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (subdomain) {
      const available = await isSubdomainAvailable(subdomain);
      return NextResponse.json({ available });
    }

    return NextResponse.json(
      { error: 'Subdomain parameter is required' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to check subdomain',
      },
      { status: 500 }
    );
  }
}

