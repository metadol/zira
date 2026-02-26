"use client";
import { ResponsiveModal } from "@/components/common/widgets/responsive-modal";
import { CreateWorkspaceForm } from "../forms/workspace-create-form";
import { useParamModal } from "@/hooks/use-param-modal";

export const CreateWorkspaceModal = () => {
  const { isOpen, close, setIsOpen } = useParamModal("create-workspace");
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Workspace"
      description="Fill the form to create a new workspace"
    >
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};
