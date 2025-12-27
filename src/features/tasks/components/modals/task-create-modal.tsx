"use client";

import { useParamModal } from "@/hooks/use-param-modal";
import { ResponsiveModal } from "@/components/common/widgets/responsive-modal";
import { CreateTaskForm } from "../forms/task-create-form";
import { CreateTaskFormWrapper } from "../wrapper/task-create-wrapper";

export const CreateTaskModal = () => {
  const { isOpen, close, setIsOpen } = useParamModal("create-task");

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
