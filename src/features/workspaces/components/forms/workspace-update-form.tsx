"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { FormWrapper } from "@/components/common/forms/form-create";
import { type Workspace } from "@/types";
import { updateWorkspaceSchema } from "../../schemas";
import { useUpdateWorkspace } from "../../api/client/use-workspace-update";

type UpdateWorkspaceFormValues = z.infer<typeof updateWorkspaceSchema>;

interface WorkspaceUpdateFormProps {
  initialValues: Workspace;
  onCancel?: () => void;
}

export function WorkspaceUpdateForm({
  initialValues,
}: WorkspaceUpdateFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();

  const form = useForm<UpdateWorkspaceFormValues>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues?.image ?? "",
      name: initialValues?.name ?? "",
    },
  });

  const onSubmit = (data: UpdateWorkspaceFormValues) => {
    let imageValue: File | string = "";
    if (data.image instanceof File) imageValue = data.image;
    else if (data.image === null) imageValue = "null";

    const finalValues = {
      ...data,
      image: imageValue,  
    };

    mutate({
      form: finalValues,
      param: { workspaceId: initialValues.$id },
    });
  };

  const handleBack = () => {
    router.push(`/workspaces/${initialValues.$id}`);
  };

  return (
    <FormWrapper
      form={form}
      onBack={handleBack}
      isPending={isPending}
      module="update-workspace"
      entityName={initialValues?.name}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
}
