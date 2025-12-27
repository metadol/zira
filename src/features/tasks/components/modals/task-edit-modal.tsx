"use client";

import { useParamModal } from "@/hooks/use-param-modal";
import { ResponsiveModal } from "@/components/common/widgets/responsive-modal";
import { CreateTaskForm } from "../forms/task-create-form";
import { useParamIdModal } from "@/hooks/use-param-id-modal";
import { EditTaskFormWrapper } from "../wrapper/task-edit-wrapper";

export const EditTaskModal = () => {
  const { id, close } = useParamIdModal("edit-task");

  return (
    <ResponsiveModal open={!!id} onOpenChange={close}>
      <EditTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
