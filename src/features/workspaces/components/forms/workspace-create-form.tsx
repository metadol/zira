"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema } from "../../schemas";

import { FormWrapper } from "@/components/common/forms/form-create";
import { useCreateWorkspace } from "../../api/client/use-workspace-create";
import { useTransition } from "react";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();
  const [isRouting, startTransition] = useTransition();

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
          startTransition(() => {
            router.push(`/workspaces/${data.$id}`);
          });
        },
      },
    );
  };

  return (
    <FormWrapper
      form={form}
      onCancel={onCancel}
      isPending={isPending || isRouting}
      module={"create-workspace"}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
};
