import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { PenIcon, X, XIcon } from "lucide-react";
import { useState } from "react";
import { useUpdateTask } from "../../api/client/use-task-update";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionProps {
  task: Task;
}
export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);

  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate(
      {
        json: { description: value },
        param: { taskId: task.$id },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>
        <Button
          size={"sm"}
          variant={"secondary"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <XIcon className="size-4" />
          ) : (
            <PenIcon className="size-4" />
          )}
        </Button>
      </div>

      <DottedSeparator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            rows={3}
            autoFocus
            value={value}
            disabled={isPending}
            className="text-sm"
            placeholder="Add a description..."
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            size="sm"
            className="ml-auto w-fit"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : (
        <div className="text-sm">
          {task.description || (
            <span className="text-muted-foreground ">
              No description set...
            </span>
          )}
        </div>
      )}
    </div>
  );
};
