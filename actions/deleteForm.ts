"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { Form } from "@/models/Form";
import { Submissions } from "@/models/Submissions"; // ✅ import your submission model
import connectDb from "@/lib/mongodb";

export const deleteForm = async (formId: string) => {
  try {
    await connectDb();
    const objectId = new mongoose.Types.ObjectId(formId);

    // Delete the form
    const form = await Form.findByIdAndDelete({ _id: objectId });
    if (!form) {
      return { success: false, message: "Form not found" };
    }

    // ✅ Delete related submissions
    await Submissions.deleteMany({ formId: objectId });

    // Revalidate cache
    revalidatePath("/dashboard/forms");

    return {
      success: true,
      message: "Form and related submissions deleted successfully.",
    };
  } catch (err) {
    console.log("Error deleting form:", err);
    return {
      success: false,
      message: "An error occurred while deleting the form",
    };
  }
};
