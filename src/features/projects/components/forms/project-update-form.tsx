"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectSchema } from "../../schema";

import { FormWrapper } from "@/components/common/forms/form-create";
import { useUpdateProject } from "../../api/client/use-project-update";
import { Project } from "@/types";
import { useParamId } from "@/hooks/use-param-id";
import { useRouter } from "next/navigation";

interface UpdateProjectFormProps {
  onCancel?: () => void;
  project: Project;
}

type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;

export const ProjectUpdateForm = ({
  project: initialValues,
}: UpdateProjectFormProps) => {
  const router = useRouter();
  const workspaceId = useParamId("workspaceId");
  const { mutate, isPending } = useUpdateProject();

  const form = useForm<UpdateProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    mode: "onChange",
    defaultValues: { ...initialValues, image: initialValues?.image ?? null },
  });

  const onSubmit = (data: UpdateProjectFormValues) => {
    let imageValue: File | string = "";
    if (data.image instanceof File) imageValue = data.image;
    else if (data.image === "" || data.image === null) imageValue = "null";

    const finalValues = {
      ...data,
      workspaceId,
      image: imageValue,
    };

    mutate(
      { form: finalValues, param: { projectId: initialValues.$id } },
      { onSuccess: () => form.reset(data) },
    );
  };

  const handleBack = () => {
    router.push(
      `/workspaces/${initialValues.workspaceid}/projects/${initialValues.$id}`,
    );
  };

  return (
    <FormWrapper
      form={form}
      onBack={handleBack}
      isPending={isPending}
      module={"update-project"}
      entityName={initialValues?.name}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
};
