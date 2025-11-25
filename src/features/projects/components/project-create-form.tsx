"use client";

// Libraries
import z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "../schema";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-seperator";
import { FormInput } from "@/components/form-input";
import { ImageUpload } from "@/components/image-upload";

// Utils / Schemas / Hooks
import { useCreateProject } from "../api/client/use-project-create";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateProject();

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateProjectFormValues) => {
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
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create Project</CardTitle>
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
                label="Project Name"
                name="name"
                type="text"
                placeholder="Enter project name"
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
                className={cn(!onCancel && "invisible", "w-full xs:w-auto")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full xs:w-auto"
              >
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
