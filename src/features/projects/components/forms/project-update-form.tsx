"use client";

// Libraries
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectSchema } from "../../schema";

// Components
import { FormWrapper } from "@/components/common/forms/form-create";

// Utils / Schemas / Hooks
import { useUpdateProject } from "../../api/client/use-project-update";
import { Project } from "@/types";
import { useParamId } from "@/hooks/use-param-id";

interface UpdateProjectFormProps {
  onCancel?: () => void;
  project: Project;
}

type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;

export const ProjectUpdateForm = ({
  project: initialValues,
}: UpdateProjectFormProps) => {
  const workspaceId = useParamId("workspaceId");
  const { mutate, isPending } = useUpdateProject();

  const form = useForm<UpdateProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: { ...initialValues, image: initialValues?.image ?? "" },
  });

  const onSubmit = (data: UpdateProjectFormValues) => {
    const finalValues = {
      ...data,
      workspaceId,
      image: data.image instanceof File ? data.image : "",
    };
    mutate({
      form: finalValues,
      param: { projectId: initialValues.$id },
    });
  };

  return (
    <FormWrapper
      form={form}
      onBack={() => {}}
      isPending={isPending}
      module={"update-project"}
      entityName={initialValues?.name}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
};
