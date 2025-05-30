"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { publishForm } from "@/actions/publishForm";
import FormPublishDialog from "./FormPublishDialog";
import { Fields } from "@/types/form";
import toast from "react-hot-toast";
import { submitForm } from "@/actions/submitForm";
import { Form } from "@/types/form";

type Props = { form: Form; isEditMode: boolean };

// Define the type of formData as a generic object where keys are strings and values are strings
type FormDataState = Record<string, string>;

const AiGeneratedForm: React.FC<Props> = ({ form, isEditMode = false }) => {
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataState>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      await publishForm(form.id);
      setSuccessDialogOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await submitForm(form.id, formData);
    if (data?.success) {
      toast.success(data.message);
      setFormData({}); // ✅ Reset the form
    } else {
      toast.error(data?.message || "Submission failed");
    }
  };

  const value = typeof form.content !== "object" ? JSON.parse(form.content) : form.content;

  let data;
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    data = value.fields;
  } else {
    data = value[0]?.fields || [];
  }

  return (
    <div>
      <form onSubmit={isEditMode ? handlePublish : handleSubmit}>
        {data.map((item: Fields, index: number) => (
          <div key={index} className="mb-4">
            <Label>{item.label}</Label>
            <Input
              type="text"
              name={item.name}
              placeholder={item.placeholder}
              required={!isEditMode}
              onChange={handleChange}
              value={formData[item.name] || ""} // ✅ Controlled input
            />
          </div>
        ))}
        <Button type="submit">{isEditMode ? "Publish" : "Submit"}</Button>
      </form>
      <FormPublishDialog
        formId={form.id}
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
      />
    </div>
  );
};

export default AiGeneratedForm;
