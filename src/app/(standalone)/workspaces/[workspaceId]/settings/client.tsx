"use client";

import { useGetWorkspaceById } from "@/features/workspaces/api/client/use-workspace-get-id";
import { WorkspaceSettings } from "@/features/workspaces/components/settings/workspace-settings";
import { useParamId } from "@/hooks/use-param-id";
import { Workspace } from "@/types";

export const WorkspaceIdSettingsClient = () => {
  const workspaceId = useParamId("workspaceId");
  const { data: initialValues, isLoading } = useGetWorkspaceById({
    workspaceId,
  });

  if (isLoading) return "loading";

  if (!initialValues) return "workspace not found";

  return (
    <div className="w-full lg:max-w-xl">
      <WorkspaceSettings workspace={initialValues as Workspace} />
    </div>
  );
};
