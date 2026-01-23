import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { PenIcon } from "lucide-react";
import { OverviewProperty } from "./overview-property";
import { UserAvatar } from "@/components/common/widgets/user-avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn, snakeCaseToTitleCase } from "@/lib/utils";
import { useParamIdModal } from "@/hooks/use-param-modal-id";

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useParamIdModal("edit-task");
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => open(task.$id)}
          >
            <PenIcon className="size-4" />
          </Button>
        </div>

        <DottedSeparator className="my-4" />

        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <span className="text-sm font-medium">
              {format(task.duedate, "PPP")}
            </span>
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
