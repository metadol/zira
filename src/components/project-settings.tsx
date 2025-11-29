import { ProjectDangerZone } from "@/features/projects/components/project-delete-form";
import { ProjectUpdateForm } from "@/features/projects/components/project-update-form";
import { Project } from "@/types";
import React from "react";

interface ProjectSettingsProps {
  initialValues: Project;
}

export const ProjectSettings = ({ initialValues }: ProjectSettingsProps) => {
  return (
    <div className="flex flex-col gap-y-6">
      <ProjectUpdateForm project={initialValues} />
      <ProjectDangerZone project={initialValues} />
    </div>
  );
};
