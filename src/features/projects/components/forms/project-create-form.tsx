"use client";

// Libraries
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "../../schema";

// Components
import { FormWrapper } from "@/components/common/forms/form-create";

// Utils / Schemas / Hooks
import { useCreateProject } from "../../api/client/use-project-create";
import { useParamId } from "@/hooks/use-param-id";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const workspaceId = useParamId("workspaceId");
  const { mutate, isPending } = useCreateProject();

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
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
        onSuccess: () => {
          form.reset();
          // TODO: Redirect to project page
        },
      }
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
