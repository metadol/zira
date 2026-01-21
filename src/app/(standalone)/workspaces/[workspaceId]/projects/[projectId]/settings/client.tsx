"use client";

// import { PageError } from "@/components/page-error";
// import { PageLoader } from "@/components/page-loader";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProjectById } from "@/features/projects/api/client/use-project-get-id";
import { ProjectSettings } from "@/features/projects/components/settings/project-settings";

export const ProjectIdSettingsClient = () => {
  const projectId = useParamId("projectId");
  const { data, isLoading } = useGetProjectById({
    projectId,
  });

  if (isLoading) {
    // return <PageLoader />;
    return "loading";
  }

  if (!data) {
    // return <PageError message="Workspace not found." />;
    return "project not found";
  }

  return (
    <div className="w-full lg:max-w-xl">
      <ProjectSettings initialValues={data} />
    </div>
  );
};
