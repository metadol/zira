"use client";
import { ResponsiveModal } from "@/components/common/widgets/responsive-modal";
import { CreateWorkspaceForm } from "../forms/workspace-create-form";
import { useParamModal } from "@/hooks/use-param-modal";

export const CreateWorkspaceModal = () => {
  const { isOpen, close, setIsOpen } = useParamModal("create-workspace");
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};
