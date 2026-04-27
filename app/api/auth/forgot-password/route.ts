import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { generatePasswordResetToken } from '@/lib/auth/tokens';
import { sendPasswordResetEmail } from '@/lib/mail';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      // For security reasons, don't reveal if the user exists
      return NextResponse.json(
        {
          success: true,
          message: 'If an account exists with this email, a password reset link has been sent.',
        },
        { status: 200 }
      );
    }

    const resetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(email, resetToken.token);

    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[FORGOT_PASSWORD_ERROR]', error);
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
        error: 'Failed to process request',
      },
      { status: 500 }
    );
  }
}

