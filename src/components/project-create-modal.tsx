"use client";

import { useParamModal } from "@/hooks/use-param-modal";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateProjectForm } from "@/features/projects/components/project-create-form";

export const CreateProjectModal = () => {
  const { isOpen, close, setIsOpen } = useParamModal("create-project");

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
