"use client";

// Libraries
import z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema } from "../schemas";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-seperator";
import { FormInput } from "@/components/form-input";
import { ImageUpload } from "@/components/image-upload";

// Utils / Schemas / Hooks
import { useCreateWorkspace } from "../api/client/use-workspace-create";
import { cn } from "@/lib/utils";
import { FormWrapper } from "@/components/work-form";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();

  const form = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (data: CreateWorkspaceFormValues) => {
    const finalValues = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };
    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <FormWrapper
      form={form}
      onCancel={onCancel}
      isPending={isPending}
      module={"create-workspace"}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
};
