export const runtime = "nodejs";
import AiGeneratedForm from "@/components/AiGeneratedForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import connectDb from "@/lib/mongodb";
import { Form as FormModel } from "@/models/Form";
import React from "react";

const Edit = async ({ params }: { params: Promise<{formId : string}> }) => {
  await connectDb();
  const {formId} = await params;

  if (!formId) {
    return <h1>No form id found for id {formId}</h1>;
  }

  const formDoc = await FormModel.findById(formId);

  if (!formDoc) {
    return <h1>No form found</h1>;
  }

  // ✅ Normalize _id to id for frontend compatibility
  const form = {
    id: formDoc._id.toString(),
    ownerId: formDoc.ownerId,
    published: formDoc.published,
    content: formDoc.content,
    submissions: formDoc.submissions,
    shareUrl: formDoc.shareUrl,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="font-bold text-2xl text-center">{form.content.title || "NA"}</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AiGeneratedForm form={form} isEditMode={true} />
      </CardContent>
    </Card>
  );
};

export default Edit;
