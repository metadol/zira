import { authGuard } from "@/features/auth/utils";
import { TaskViewSwitcher } from "@/features/tasks/components/switcher/task-view-switcher";

const TaskPage = async () => {
  await authGuard("protected");
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TaskPage;
