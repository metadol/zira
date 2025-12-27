"use client";

// Libraries
import z from "zod";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "../../schema";

// Components
import { FormWrapper } from "@/components/common/forms/work-form";

// Utils / Schemas / Hooks
import { useCreateTask } from "../../api/client/use-task-create";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { FormInput } from "@/components/common/forms/form-input";
import { Form } from "@/components/ui/form";
import { DatePicker } from "@/components/common/widgets/date-picker";
import { Task, TaskStatus } from "@/types";
import { useUpdateTask } from "../../api/client/use-task-update";

interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions?: Array<{ id: string; name: string; imageurl?: string }>;
  memberOptions?: Array<{ id: string; name: string }>;
  statusOptions?: Array<{ id: string; name: string }>;
  initialValues?: Task;
}

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

export const EditTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  statusOptions,
  initialValues,
}: CreateTaskFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema) as Resolver<CreateTaskFormValues>,
    defaultValues: {
      name: initialValues?.name || "",
      dueDate: initialValues?.duedate
        ? new Date(initialValues.duedate)
        : undefined,
      assigneeId: initialValues?.assigneeid || undefined,
      description: "",
      projectId: initialValues?.projectid || undefined,
      status: initialValues?.status || undefined,
      workspaceId: initialValues?.workspaceid || workspaceId,
    },
  });

  const onSubmit = async (values: CreateTaskFormValues) => {
    mutate(
      {
        json: values,
        param: { taskId: initialValues?.$id || "" },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onCancel?.();
          // TODO: Redirect to task page
        },
      }
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
};
