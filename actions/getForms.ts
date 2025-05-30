// getForms.ts
"use server";
import connectDb from "@/lib/mongodb";
import { Form } from "@/models/Form";
import { currentUser } from "@clerk/nextjs/server";

export const getForms = async () => {
  await connectDb();
  const user = await currentUser();
  if (!user) {
    return { data: [] };
  }

  const forms = await Form.find({ ownerId: user.id });

  const formattedForms = forms.map((form) => ({
    id: form._id.toString(),
    ownerId: form.ownerId,
    published: form.published,
    content: form.content,
    submissions: form.submissions,
    shareUrl: form.shareUrl,
  }));

  return { data: formattedForms };
};
