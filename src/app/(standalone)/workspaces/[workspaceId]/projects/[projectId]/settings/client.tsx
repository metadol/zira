"use client";

import { useGetProjectById } from "@/features/projects/api/client/use-project-get-id";
import { ProjectSettings } from "@/features/projects/components/settings/project-settings";
import { useParamId } from "@/hooks/use-param-id";

export const ProjectIdSettingsClient = () => {
  const projectId = useParamId("projectId");
  const { data, isLoading } = useGetProjectById({
    projectId,
  });

  if (isLoading) return "loading";

  if (!data) return "project not found";

  return (
    <div className="w-full lg:max-w-xl">
      <ProjectSettings initialValues={data} />
    </div>
  );
};
