import { authGuard } from "@/features/auth/utils";
import { TaskIdClient } from "./client";

const TaskIdPage = async () => {
  await authGuard("protected");
  return <TaskIdClient />;
};

export default TaskIdPage;
