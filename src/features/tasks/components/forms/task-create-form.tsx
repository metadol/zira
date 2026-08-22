"use client";

import z from "zod";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createTaskSchema } from "../../schema";
import { useCreateTask } from "../../api/client/use-task-create";
import { useParamId } from "@/hooks/use-param-id";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/common/forms/form-input";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types";

interface CreateTaskFormProps {
  onCancel?: () => void;
  initialStatus?: TaskStatus | null;
  projectOptions?: Array<{ id: string; name: string; imageurl?: string }>;
  memberOptions?: Array<{ id: string; name: string }>;
  statusOptions?: Array<{ id: string; name: string }>;
}

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

export const CreateTaskForm = ({
  onCancel,
  initialStatus,
  projectOptions,
  memberOptions,
  statusOptions,
}: CreateTaskFormProps) => {
  const workspaceId = useParamId("workspaceId");
  const projectId = useParamId("projectId");
  const { mutate, isPending } = useCreateTask();

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema) as Resolver<CreateTaskFormValues>,
    mode: "onChange",
    defaultValues: {
      name: "",
      dueDate: undefined,
      assigneeId: undefined,
      description: "",
      projectId: projectId ?? undefined,
      status: initialStatus ?? undefined,
      workspaceId,
    },
  });

  const { isValid } = form.formState;

  const onSubmit = async (values: CreateTaskFormValues) => {
    mutate(
      { json: values },
      {
        onSuccess: ({}) => {
          form.reset();
          onCancel?.();
        },
      },
    );
  };

  return (
    <Card className={cn("border-none shadow-none")}>
      <CardHeader className={cn("flex p-7")}>
        <CardTitle className="text-xl font-bold">Create a New Task</CardTitle>
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
                label="Task Name"
                name="name"
                type="text"
                placeholder="Enter task name"
              />
              <FormInput
                control={form.control}
                name="dueDate"
                label="Due Date"
                type="date"
              />
              <FormInput
                control={form.control}
                name="assigneeId"
                label="Assignee"
                type="select"
                placeholder="Select assignee"
                options={memberOptions?.map((member) => ({
                  value: member.id,
                  label: member.name,
                }))}
              />
              <FormInput
                control={form.control}
                name="status"
                label="Status"
                type="select"
                placeholder="Select status"
                options={statusOptions?.map((status) => ({
                  value: status.id,
                  label: status.name,
                }))}
              />
              <FormInput
                control={form.control}
                name="projectId"
                label="Project"
                type="select"
                placeholder="Select project"
                options={projectOptions?.map((project) => ({
                  value: project.id,
                  label: project.name,
                }))}
              />
              <FormInput
                control={form.control}
                name="description"
                label="Description"
                type="textarea"
                placeholder="Enter description..."
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
                className="w-full xs:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isPending || !isValid}
                className="w-full xs:w-auto"
              >
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
