import { useQueryState, parseAsStringEnum } from "nuqs";
import { TaskStatus } from "@/types";

export const useTaskStatusParam = () => {
  const [status, setStatus] = useQueryState(
    "create-status",
    parseAsStringEnum<TaskStatus>(Object.values(TaskStatus))
      .withDefault(TaskStatus.TODO)
      .withOptions({ clearOnDefault: true })
  );

  return { status, setStatus, clear: () => setStatus(null) };
};