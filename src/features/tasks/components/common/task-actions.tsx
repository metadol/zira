import { Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useConfirm } from "@/hooks/use-confirm";
import { useParamIdModal } from "@/hooks/use-param-modal-id";
import { useDeleteTask } from "../../api/client/use-task-delete";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, children }: TaskActionsProps) => {
  const { mutate, isPending } = useDeleteTask();
  const { open: openEditModal } = useParamIdModal("edit-task");
  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Delete task",
    message: "This action cannot be undone.",
    variant: "destructive",
  });

  const editTask = () => {
    openEditModal(id);
  };

  const deleteTask = async () => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    mutate({ param: { taskId: id } });
  };

  return (
    <div className="flex justify-end">
      <DeleteDialog />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild disabled={isPending}>
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuItem
            onClick={editTask}
            className={"p-[10px] font-medium"}
          >
            <Edit className="mr-2 size-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={deleteTask}
            className={`p-[10px] font-medium text-amber-700 focus:text-amber-700`}
          >
            <Trash className="mr-2 size-4 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
