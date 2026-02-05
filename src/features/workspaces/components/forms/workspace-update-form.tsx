"use client";

// Libraries
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Components
import { FormWrapper } from "@/components/common/forms/work-form";

// Utils / Schemas/ Hooks
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
  onCancel,
}: WorkspaceUpdateFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();

  const form = useForm<UpdateWorkspaceFormValues>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues?.image ?? "",
    },
  });

  const onSubmit = (data: UpdateWorkspaceFormValues) => {
    const finalValues = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };

    mutate(
      { form: finalValues, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
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
