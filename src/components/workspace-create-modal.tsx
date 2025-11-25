"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateWorkspaceForm } from "../features/workspaces/components/workspace-create-form";
import { useParamModal } from "@/hooks/use-param-modal";

export const CreateWorkspaceModal = () => {
  const { isOpen, close, setIsOpen } = useParamModal("create-workspace");
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};
