"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { FormInput } from "@/components/form-input";
import { ImageUpload } from "@/components/image-upload";
import { DottedSeparator } from "@/components/dotted-seperator";

import { cn } from "@/lib/utils";
import { useUpdateWorkspace } from "../api/client/use-workspace-update";
import { updateWorkspaceSchema } from "../schemas";
import { type Workspace } from "@/types";

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

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button
          size="sm"
          variant="secondary"
          onClick={
            onCancel
              ? onCancel
              : () => router.push(`/workspaces/${initialValues.$id}`)
          }
        >
          <ArrowLeftIcon className="size-4 mr-1" />
          Back
        </Button>
        <CardTitle className="text-xl font-bold">{initialValues?.name}</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="flex flex-col gap-y-4">
              <FormInput
                control={form.control}
                label="Workspace Name"
                name="name"
                type="text"
                placeholder="Enter workspace name"
                disabled={isPending}
              />

              <FormField
                disabled={isPending}
                control={form.control}
                name="image"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                )}
              />
            </div>

            <DottedSeparator className="py-7" />

            <div className="flex flex-col-reverse xs:flex-row gap-y-2 items-center justify-between">
              <Button
                variant="secondary"
                onClick={onCancel}
                size="lg"
                type="button"
                disabled={isPending}
                className={cn(
                  !onCancel && "hidden xs:invisible xs:block",
                  "w-full xs:w-auto"
                )}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full xs:w-auto"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
