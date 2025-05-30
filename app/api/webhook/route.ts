import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectDb from "@/lib/mongodb";
import { Subscription } from "@/models/Subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;

  let event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error("Missing userId in metadata.");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
      await connectDb();

      await Subscription.findOneAndUpdate(
        { userId },
        { subscribed: true },
        { upsert: true, new: true }
      );

      console.log(`Subscription activated for user ${userId}`);
    } catch (dbErr) {
      console.error("MongoDB error:", dbErr);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}


 