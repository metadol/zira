import { ProjectUpdateForm } from "@/features/projects/components/project-update-form";
import { Project } from "@/types";
import React from "react";

interface ProjectSettingsProps {
  initialValues: Project;
}

export const ProjectSettings = ({ initialValues }: ProjectSettingsProps) => {
  return (
    <div>
      <ProjectUpdateForm initialValues={initialValues} />
    </div>
  );
};
