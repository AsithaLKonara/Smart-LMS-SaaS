
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.tenantId) {
      return new NextResponse("Tenant ID missing", { status: 400 });
    }

    const tenantId = session.metadata.tenantId;
    const plan = session.metadata.plan as any || 'PRO';

    await prisma.billingProfile.upsert({
        where: { tenantId },
        create: {
            tenantId,
            currentPlan: plan,
            billingEmail: session.customer_details?.email || '',
            subscriptionStatus: 'active',
            seatLimit: plan === 'PRO' ? 500 : 50,
        },
        update: {
            currentPlan: plan,
            subscriptionStatus: 'active',
            seatLimit: plan === 'PRO' ? 500 : 50,
        }
    });

    // Also update Tenant model plan for consistency
    await prisma.tenant.update({
        where: { id: tenantId },
        data: { plan }
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update grace period or next billing date if needed
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const tenantId = subscription.metadata.tenantId;

    if (tenantId) {
        await prisma.billingProfile.update({
            where: { tenantId },
            data: {
                subscriptionStatus: 'canceled',
                currentPlan: 'FREE',
                seatLimit: 10
            }
        });

        await prisma.tenant.update({
            where: { id: tenantId },
            data: { plan: 'FREE' }
        });
    }
  }

  return new NextResponse(null, { status: 200 });
}
