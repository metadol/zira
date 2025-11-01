"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateWorkspaceForm } from "./workspace-create-form";
import { useCreateWorkSpaceModal } from "@/hooks/use-workspace-modal";

export const CreateWorkspaceModal = () => {
  const { isOpen, close, setIsOpen } = useCreateWorkSpaceModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};
