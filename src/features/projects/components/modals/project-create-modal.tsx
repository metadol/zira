"use client";

import { useParamModal } from "@/hooks/use-param-modal";
import { ResponsiveModal } from "@/components/common/widgets/responsive-modal";
import { CreateProjectForm } from "@/features/projects/components/forms/project-create-form";

export const CreateProjectModal = () => {
  const { isOpen, close, setIsOpen } = useParamModal("create-project");

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Project"
      description="Fill the form to create a new project"
    >
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
