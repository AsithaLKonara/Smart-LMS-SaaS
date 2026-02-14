import { NextRequest, NextResponse } from 'next/server';
import { createTenant, isSubdomainAvailable } from '@/lib/db/queries/tenants';
import { createUser } from '@/lib/auth/user';
import { tenantOnboardingSchema } from '@/lib/validation/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = tenantOnboardingSchema.parse(body);

    // Check if subdomain is available
    const available = await isSubdomainAvailable(validatedData.subdomain);
    if (!available) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subdomain is already taken. Please choose another one.',
        },
        { status: 400 }
      );
    }

    // Create tenant
    const tenant = await createTenant({
      name: validatedData.organizationName,
      subdomain: validatedData.subdomain,
      plan: validatedData.plan,
    });

    // Create admin user
    const admin = await createUser(
      validatedData.adminEmail,
      validatedData.adminPassword,
      validatedData.adminName,
      tenant.id,
      'ADMIN'
    );

    return NextResponse.json(
      {
        success: true,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          subdomain: tenant.subdomain,
          plan: tenant.plan,
        },
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: JSON.parse(error.message),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Onboarding failed',
      },
      { status: 500 }
    );
  }
}

