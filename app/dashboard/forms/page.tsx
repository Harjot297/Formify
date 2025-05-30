export const runtime = "nodejs";
import { getForms } from "@/actions/getForms";
import FormList from "@/components/FormList";
import GenerateFormInput from "@/components/GenerateFormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import connectDb from "@/lib/mongodb";
import { Plus } from "lucide-react";
import React from "react";
import { Form } from "@/types/form";

const MyForm = async () => {
  await connectDb();
  const forms = await getForms();
  const total = forms.data.length;
  return (
    <div>
      <section className="flex items-center justify-between max-w-7xl mx-auto mb-4">
        <h1 className="font-bold text-xl">My Forms</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              {" "}
              <Plus /> Create New Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Write a prompt</DialogTitle>
              <DialogDescription>
                Write a clean prompt to get better results.
              </DialogDescription>
            </DialogHeader>
            <GenerateFormInput totalForms={total} />
          </DialogContent>
        </Dialog>
      </section>
      <div className="grid grid-cols-3 gap-2">
        {forms?.data?.map((form:Form, index: number) => (
          <FormList key={index} form={form} />
        ))}
      </div>
    </div>
  );
};

export default MyForm;