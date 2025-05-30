"use server";

import connectDb from "@/lib/mongodb";
import { Subscription } from "@/models/Subscription";

export const createSubscription = async (userId: string) => {
    try {
        await connectDb();

        // ✅ Save userId as string — no need for ObjectId
        const subscription = await Subscription.create({
            userId: userId,
            subscribed: true,
        });

        const formattedSubscription = {
            id: subscription._id.toString(),
            userId: subscription.userId,  // return as stored
            subscribed: subscription.subscribed,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
        };

        return formattedSubscription;
    } catch (err) {
        console.log("Create subscription error:", err);
        return null;
    }
};

export const getUserSubscription = async (userId: string) => {
    await connectDb();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const subscription = await Subscription.findOne({ userId: userId });

    return subscription?.subscribed ?? false;
};
