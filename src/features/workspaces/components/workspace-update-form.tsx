"use client";

// React
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

// Validation
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWorkspaceSchema } from "../schemas";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-seperator";
import { FormInput } from "@/components/form-input";
import { ImageUpload } from "@/components/image-upload";

// API Hooks
import { useUpdateWorkspace } from "../api/client/use-workspace-update";
import { cn } from "@/lib/utils";

//Appwrite SDK
import { type Models } from "node-appwrite";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/client/use-workspace-delete";

type UpdateWorkspaceFormValues = z.infer<typeof updateWorkspaceSchema>;
export type Workspace = Models.Document & {
  name: string;
  image?: string;
  userid: string;
  inviteCode: string;
};

interface UpdateWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const UpdateWorkspaceForm = ({
  onCancel,
  initialValues,
}: UpdateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: mutateDelete, isPending: isPendingDelete } =
    useDeleteWorkspace();

  const { confirm, ConfirmationDialog } = useConfirm({
    title: "Delete Workspace",
    message:
      "Are you sure you want to delete this workspace? This action cannot be undone.",
    variant: "destructive",
  });

  const form = useForm<UpdateWorkspaceFormValues>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues?.image ?? "",
    },
  });

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    console.log("Workspace deleting");
    mutateDelete(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  const onSubmit = (data: UpdateWorkspaceFormValues) => {
    if (!initialValues) return;

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
    <div className="flex flex-col gap-y-4">
      <ConfirmationDialog isPending={isPendingDelete} />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-1" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues?.name}
          </CardTitle>
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

              <div className="flex flex-col-reverse xs:flex-row gap-y-2 items-center justify-between ">
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  size="lg"
                  type="button"
                  disabled={isPending}
                  className={cn(
                    !onCancel && "hidden xs:invisible xs:block",
                    "w-full xs:w-auto "
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

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={isPending}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
