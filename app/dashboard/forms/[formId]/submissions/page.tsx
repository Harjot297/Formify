export const runtime = "nodejs";

import SubmissionsDetails from "@/components/SubmissionsDetails";
import connectDb from "@/lib/mongodb";
import { Submissions } from "@/models/Submissions";
import mongoose from "mongoose";
import React from "react";
import { Content } from "@/types/form";

type SubmissionType = {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  formId: mongoose.Types.ObjectId;
  content: Content;
};

const SubmissionsPage = async ({ params }: { params: Promise<{ formId: string }> }) => {
  await connectDb();
  const { formId } = await params;

  if (!mongoose.Types.ObjectId.isValid(formId)) {
    return <h1>Invalid form ID: {formId}</h1>;
  }

  const submissions = await Submissions.find({ formId }).populate("formId");

  if (!submissions || submissions.length === 0) {
    return <h1>No submissions found for form ID {formId}</h1>;
  }

  console.log("Submissions are:", submissions[0].content);

  return (
    <div>
      {submissions.map((submission: SubmissionType, index: number) => (
        <SubmissionsDetails key={submission._id.toString()} submission={submission} index={index} />
      ))}
    </div>
  );
};

export default SubmissionsPage;
