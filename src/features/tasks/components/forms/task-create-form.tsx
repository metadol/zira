"use client";

// Libraries
import z from "zod";
import { useForm } from "react-hook-form";
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
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateTask();

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      dueDate: undefined,
      assigneeId: undefined,
      description: "",
      projectId: undefined,
      status: initialStatus ?? undefined,
      workspaceId,
    },
  });

  const onSubmit = (data: CreateTaskFormValues) => {
    mutate(
      { json: { ...data, workspaceId } },
      {
        onSuccess: () => {
          form.reset();
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
                  id: member.id,
                  value: member.name,
                }))}
              />
              <FormInput
                control={form.control}
                name="status"
                label="Status"
                type="select"
                placeholder="Select status"
                options={statusOptions?.map((status) => ({
                  id: status.id,
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
                  id: project.id,
                  value: project.name,
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
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
