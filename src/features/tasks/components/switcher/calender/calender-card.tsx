import { useRouter } from "next/navigation";

// import { ProjectAvatar } from "@/features/projects/components/common/project-avatar";
import { cn } from "@/lib/utils";

import { TaskStatus, type Member, type Project } from "@/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ProjectAvatar } from "@/features/projects/components/common/project-avatar";
import { UserAvatar } from "@/components/common/widgets/user-avatar";

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
  assignee,
  project,
  status,
  id,
}: CalenderCardProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-2 pb-2">
      <button
        onClick={onClick}
        className={cn(
          "flex w-full text-left cursor-pointer flex-col gap-y-1.5 rounded-md border border-l-4 bg-white p-1.5 text-xs text-primary transition hover:opacity-75",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>

        {/* <div className="flex items-center gap-x-1">
          <UserAvatar
            name={assignee?.name}
            className="size-5"
            fallbackclassName="text-[9px]"
          />

          <div aria-hidden className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar
            name={project?.name}
            image={project?.image}
            className="size-5 rounded-full"
            fallbackClassName="text-[9px]"
          />
        </div> */}
      </button>
    </div>
  );
};
