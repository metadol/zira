"use client";

// import { PageError } from "@/components/page-error";
// import { PageLoader } from "@/components/page-loader";

import { useGetWorkspaceById } from "@/features/workspaces/api/client/use-workspace-get-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { WorkspaceSettings } from "@/features/workspaces/components/settings/workspace-settings";
import { type Workspace } from "@/types";

export const WorkspaceIdSettingsClient = () => {
  const workspaceId = useParamId("workspaceId");
  const { data: initialValues, isLoading } = useGetWorkspaceById({
    workspaceId,
  });

  if (isLoading) {
    // return <PageLoader />;
    return "loading";
  }

  //   if (!initialValues) {
  //     return <PageError message="Workspace not found." />;
  //   }

  return (
    <div className="w-full lg:max-w-xl">
      <WorkspaceSettings workspace={initialValues as Workspace} />
    </div>
  );
};
