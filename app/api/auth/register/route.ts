import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth/user';
import { z } from 'zod';
import { assertSeatAvailable, assertTenantOperational } from '@/lib/billing/seats';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  tenantId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const op = await assertTenantOperational(validatedData.tenantId);
    if (!op.ok) {
      return NextResponse.json({ success: false, error: op.message }, { status: 403 });
    }

    const seats = await assertSeatAvailable(validatedData.tenantId);
    if (!seats.ok) {
      return NextResponse.json({ success: false, error: seats.message }, { status: 403 });
    }

    const user = await createUser(
      validatedData.email,
      validatedData.password,
      validatedData.name,
      validatedData.tenantId
    );

    // User is already returned without password from createUser
    return NextResponse.json(
      {
        success: true,
        user,
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
        error: error instanceof Error ? error.message : 'Registration failed',
      },
      { status: 500 }
    );
  }
}

