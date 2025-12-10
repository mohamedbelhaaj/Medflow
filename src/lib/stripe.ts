import Stripe from "stripe";

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export async function createCheckoutSession({
  storeId,
  invoiceId,
  amount,
  email,
}: {
  storeId: string;
  invoiceId: string;
  amount: number;
  email?: string;
}) {
  return await stripe.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: { name: `Invoice #${invoiceId}` },
          unit_amount: Math.round(amount * 100),
        },
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices/${invoiceId}?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices/${invoiceId}?canceled=1`,
    metadata: { invoiceId, storeId },
    customer_email: email,
  });
}