import { Task } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { TaskActions } from "../../common/task-actions";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { UserAvatar } from "@/components/common/widgets/user-avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ProjectAvatar } from "@/features/projects/components/common/project-avatar";

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectid}>
          <MoreHorizontal className="size-4" />
        </TaskActions>
      </div>

      <DottedSeparator />

      <div className="flex items-center gap-x-1.5">
        <UserAvatar
          name={task.assignee.name}
          className="size-5"
          fallbackclassName="text-[9px]"
        />
        <div aria-hidden className="size-1 rounded-full bg-neutral-300" />
        <span className={cn("truncate text-[11px]")}>
          {format(task.duedate, "MMM do, yyyy")}
        </span>
      </div>

      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project.name}
          image={task.project.image}
          className="size-5 rounded-full"
          fallbackClassName="text-[9px]"
        />
        <div aria-hidden className="size-1 rounded-full bg-neutral-300" />
        <span className="text-[12px] font-medium">{task.project.name}</span>
      </div>
    </div>
  );
};
