import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Delete,
  DeleteIcon,
  Edit,
  ExternalLinkIcon,
  Trash,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTask } from "../../api/client/use-task-delete";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Delete task",
    message: "This action cannot be undone.",
    variant: "destructive",
  });
  const { mutate, isPending } = useDeleteTask();

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    mutate({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
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
            onClick={onOpenTask}
            className="p-[10px] font-medium"
          >
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}} className="p-[10px] font-medium">
            <Edit className="mr-2 size-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="p-[10px] font-medium text-amber-700 focus:text-amber-700"
          >
            <Trash className="mr-2 size-4 stroke-2 " />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
