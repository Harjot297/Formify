"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { PricingPlan, pricingPlan } from "@/lib/pricingplan";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { getStripe } from "@/lib/stripe-client";
import toast from "react-hot-toast";

type Props = {
  userId: string | undefined;
};

const PricingPage: React.FC<Props> = ({ userId }) => {
  const router = useRouter();

  const checkoutHandler = async (price: number, plan: string) => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    if (price === 0) {
      toast.success("✅ Free plan activated!");
      return;
    }
    try {
      const { sessionId, error } = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price, userId, plan }),
      }).then((res) => res.json());

      if (error) {
        toast.error("❌ Failed to create checkout session");
        return;
      }

      const stripe = await getStripe();
      const { error: stripeError } = await stripe!.redirectToCheckout({ sessionId });

      if (stripeError) {
        toast.error(`❌ Stripe error: ${stripeError.message}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <div className="text-center mb-16">
        <h1 className="font-extrabold text-3xl">Plan and Pricing</h1>
        <p className="text-gray-500">
          Receive unlimited credits when you pay early, and save your plan.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlan.map((plan: PricingPlan, index: number) => (
          <Card
            className={`${
              plan.level === "Enterprise" && "bg-[#1c1c1c] text-white"
            } w-full flex flex-col justify-between`}
            key={index}
          >
            <CardHeader className="flex flex-row items-center gap-2">
              <CardTitle>{plan.level}</CardTitle>
              {plan.level === "Pro" && (
                <Badge className="rounded-full bg-orange-600">
                  🔥 Popular
                </Badge>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-2xl font-bold">{plan.price}</p>
              <ul className="mt-4 space-y-2">
                {plan.services.map((item: string, idx: number) => (
                  <li className="flex items-center" key={idx}>
                    <span className="text-green-500 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={
                  plan.level === "Enterprise" ? "default" : "outline"
                }
                className={`${
                  plan.level === "Enterprise" &&
                  "text-black bg-white hover:bg-gray-200"
                } w-full`}
                onClick={() =>
                  checkoutHandler(
                    plan.level === "Pro"
                      ? 29
                      : plan.level === "Enterprise"
                      ? 70
                      : 0,
                    plan.level
                  )
                }
              >
                Get started with {plan.level}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
