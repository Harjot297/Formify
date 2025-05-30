"use server";

import connectDb from "@/lib/mongodb";
import { Form } from "@/models/Form";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export const publishForm = async (formId: string) => {
    try {
        await connectDb();
        const user = await currentUser();
        if (!user) {
            return { success: false, message: "User not found" };
        }

        if (!formId) {
            return { success: false, message: "Form ID is required" };
        }

        const objectId = new mongoose.Types.ObjectId(formId);

        const form = await Form.findById(objectId);
        if (!form) {
            return { success: false, message: "Form not found" };
        }

        if (form.ownerId !== user.id) {
            return { success: false, message: "Unauthorized" };
        }

        if (form.published) {
            return { success: false, message: "Form is already published" };
        }

        await Form.updateOne({ _id: objectId }, { published: true });

        return {
            success: true,
            message: "Form published successfully",
        };
    } catch (err) {
        console.log("Error publishing form:", err);
        return { success: false, message: "An error occurred while publishing the form" };
    }
};
