import { Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTask } from "../../api/client/use-task-delete";
import { useParamId } from "@/hooks/use-param-id";
import { Project, Task } from "@/types";
import { ProjectAvatar } from "@/features/projects/components/common/project-avatar";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const router = useRouter();
  const workspaceId = useParamId("workspaceId");

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete Task",
    message: "This action cannot be undone.",
    variant: "destructive",
  });

  const { mutate: deleteTask, isPending } = useDeleteTask();

  const handleDeleteTask = async () => {
    const ok = await confirm();

    if (!ok) return;

    deleteTask(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <div className="flex items-center gap-x-2">
        <ProjectAvatar
          name={project.name}
          image={project.image}
          className="size-8"
        />
      </div>
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm font-semibold text-muted-foreground transition hover:opacity-75 lg:text-lg">
          {project.name.toLowerCase()}
        </p>
      </Link>
      /
      <p className="text-sm font-semibold lg:text-lg">
        {task.name.toLowerCase()}
      </p>
      <Button
        disabled={isPending}
        onClick={handleDeleteTask}
        className="ml-auto"
        variant="destructive"
        size="sm"
      >
        <Trash className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete task</span>
      </Button>
    </div>
  );
};
