"use client";

import { ResponsiveModal } from "@/components/common/widgets/responsive-modal";
import { useParamIdModal } from "@/hooks/use-param-modal-id";
import { EditTaskFormWrapper } from "../wrapper/task-edit-wrapper";

export const EditTaskModal = () => {
  const { id, close } = useParamIdModal("edit-task");

  return (
    <ResponsiveModal open={!!id} onOpenChange={close}>
      {id && <EditTaskFormWrapper id={id} onCancel={close} />}
    </ResponsiveModal>
  );
};
