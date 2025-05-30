export const runtime = "nodejs";
import AiGeneratedForm from "@/components/AiGeneratedForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import connectDb from "@/lib/mongodb";
import { Form } from "@/models/Form";
import mongoose from "mongoose";
import React from "react";

const Edit = async ({ params }: { params: Promise<{ formId: string }> }) => {
  await connectDb();
  const {formId} = await params;
  const iid = new mongoose.Types.ObjectId(formId);
  if (!formId || !mongoose.Types.ObjectId.isValid(formId)) {
    return <h1>Invalid or missing form id: {formId}</h1>;
  }

  const form = await Form.findById(iid);

  if (!form) {
    
    return <h1>No form found for id {formId}</h1>;
  }
  // Normalize _id to id for frontend compatibility
  const normalizedForm = {
    id: form._id.toString(), // Normalizing the _id to id
    ownerId : form.ownerId,
    published: form.published,
    content: form.content,
    submissions: form.submissions,
    shareUrl: form.shareUrl,
  };
  console.log("Normalized Form : ",normalizedForm);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="font-bold text-2xl text-center">
            {normalizedForm.content?.title || "NA"}
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AiGeneratedForm form={normalizedForm} isEditMode={false} />
      </CardContent>
    </Card>
  );
};

export default Edit;
