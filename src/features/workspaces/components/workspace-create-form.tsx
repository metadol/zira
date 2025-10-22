"use client";
import { useForm } from "react-hook-form";
import { createWorkspaceSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-seperator";
import { FormInput } from "@/components/form-input";
import { useCreateWorkspace } from "../api/client/use-workspace-create";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}
type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const { mutate, isPending } = useCreateWorkspace();

  const form = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateWorkspaceFormValues) => {
    console.log(data);
    mutate({ json: data });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7 ">
        <CardTitle className="text-xl font-bold">Create Workspace</CardTitle>
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
              />
            </div>

            <DottedSeparator className="py-7" />

            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={onCancel}
                size={"lg"}
                type="button"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" size={"lg"} disabled={isPending}>
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
