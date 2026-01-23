"use client";

import { useParamId } from "@/hooks/use-param-id";
import { useGetTaskById } from "@/features/tasks/api/client/use-task-get-id";
import { TaskBreadcrumbs } from "@/features/tasks/components/overview/task-breadcrumb";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { TaskOverview } from "@/features/tasks/components/overview/task-overview";
import { TaskDescription } from "@/features/tasks/components/overview/task-description";

export const TaskIdClient = () => {
  const taskId = useParamId("taskId");
  const { data: task, isLoading } = useGetTaskById({ taskId });

  if (isLoading) return "loading";

  if (!task) return "task not found";

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={task.project} task={task} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
      </div>
    </div>
  );
};
