"use server";

import connectDb from "@/lib/mongodb";
import { Form } from "@/models/Form";
import { Submissions } from "@/models/Submissions";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export const submitForm = async (formId: string, formData: any) => {
  try {
    await connectDb();
    // const user = await currentUser();
    // if (!user) {
    //   return { success: false, message: "User not found" };
    // }

    const objectId = new mongoose.Types.ObjectId(formId);

    const form = await Form.findById(objectId);
    if (!form) {
      return { success: false, message: "Form not found" };
    }

    const submissionData = await Submissions.create({
      formId: objectId,
      content: formData,
    });

    await Form.findByIdAndUpdate(
      objectId,
      {
        $inc: { submissions: 1 },
        $push: { formSubmissions: submissionData._id },
      }
    );
    revalidatePath("/dashboard/forms");
    return { success: true, message: "Form submitted successfully." };
  } catch (err) {
    console.log("Submit Form Error:", err);
    return { success: false, message: "An error occurred during submission." };
  }
};
