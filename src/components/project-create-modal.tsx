"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateProjectForm } from "@/features/projects/components/project-create-form";
import { useCreateProjectModal } from "@/features/projects/hooks/use-project-modal";

export const CreateWorkspaceModal = () => {
  const { isOpen, close, setIsOpen } = useCreateProjectModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
