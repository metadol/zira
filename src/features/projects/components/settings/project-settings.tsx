
import { Project } from "@/types";
import React from "react";
import { ProjectUpdateForm } from "../forms/project-update-form";
import { ProjectDangerZone } from "../forms/project-delete-form";

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
