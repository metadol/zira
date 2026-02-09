import { Edit, ExternalLinkIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useConfirm } from "@/hooks/use-confirm";
import { useParamId } from "@/hooks/use-param-id";
import { useParamIdModal } from "@/hooks/use-param-modal-id";
import { useDeleteTask } from "../../api/client/use-task-delete";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, children }: TaskActionsProps) => {
  const router = useRouter();
  const workspaceId = useParamId("workspaceId");
  const { open: openEditModal } = useParamIdModal("edit-task");

  const { mutate, isPending } = useDeleteTask();

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Delete task",
    message: "This action cannot be undone.",
    variant: "destructive",
  });

  const openTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const editTask = () => {
    openEditModal(id);
  };

  const deleteTask = async () => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    mutate({ param: { taskId: id } });
  };

  const itemClass = "p-[10px] font-medium";

  return (
    <div className="flex justify-end">
      <DeleteDialog />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild disabled={isPending}>
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuItem onClick={openTask} className={itemClass}>
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
            Task Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={editTask} className={itemClass}>
            <Edit className="mr-2 size-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={deleteTask}
            className={`${itemClass} text-amber-700 focus:text-amber-700`}
          >
            <Trash className="mr-2 size-4 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
