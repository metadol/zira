import { cn } from "@/lib/utils";
import { TaskStatus, type Member, type Project } from "@/types";


interface CalenderCardProps {
  title: string;
  assignee: Member;
  project: Project;
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-violet-500",
  [TaskStatus.TODO]: "border-red-500",
  [TaskStatus.IN_PROGRESS]: "border-amber-500",
  [TaskStatus.IN_REVIEW]: "border-sky-500",
  [TaskStatus.DONE]: "border-emerald-500",
};

export const CalenderCard = ({
  title,
  status,
  id,
}: CalenderCardProps) => {
  
  return (
    <div className="p-0 xs:px-2 pb-2">
      <button
        className={cn(
          "flex w-full text-left flex-col gap-y-1.5 rounded-md border border-l-4 bg-white p-1.5  text-[6px] xs:text-xs text-primary transition hover:opacity-75",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
      </button>
    </div>
  );
};
