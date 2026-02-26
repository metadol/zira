"use client";

import { ResponsiveModal } from "@/components/common/widgets/responsive-modal";
import { CreateTaskFormWrapper } from "../wrapper/task-create-wrapper";
import { useCreateTaskModal } from "../../hooks/use-task-create";

export const CreateTaskModal = () => {
  const { isOpen, close, setIsOpen, status } = useCreateTaskModal();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Task"
      description="Fill the form to create a new task"
    >
      <CreateTaskFormWrapper onCancel={close} initialStatus={status} />
    </ResponsiveModal>
  );
};
