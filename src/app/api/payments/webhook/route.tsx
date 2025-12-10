import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Stripe } from "stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    // Handle Stripe webhook events
    const event = body;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const invoiceId = session.metadata?.invoiceId;

      if (invoiceId) {
        // Update invoice status
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: "PAID",
            paidAt: new Date(),
            stripeId: session.id,
          },
        });

        // Create payment record
        await prisma.payment.create({
          data: {
            invoiceId: invoiceId,
            amount: session.amount_total / 100,
            status: "COMPLETED", // Use uppercase to match enum
            stripeId: session.payment_intent,
            method: "card",
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}