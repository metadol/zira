"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "../../schema";

import { FormWrapper } from "@/components/common/forms/form-create";
import { useCreateProject } from "../../api/client/use-project-create";
import { useParamId } from "@/hooks/use-param-id";
import { useRouter } from "next/navigation";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const router = useRouter();
  const workspaceId = useParamId("workspaceId");
  const { mutate, isPending } = useCreateProject();

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    mode: "onChange",
    defaultValues: { name: "", workspaceId },
  });

  const onSubmit = (data: CreateProjectFormValues) => {
    const finalValues = {
      ...data,
      workspaceId,
      image: data.image instanceof File ? data.image : "",
    };
    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      },
    );
  };

  return (
    <FormWrapper
      form={form}
      onCancel={onCancel}
      isPending={isPending}
      module={"create-project"}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
};
