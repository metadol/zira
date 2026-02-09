"use client";

import { Workspace } from "@/types";
import { useParamId } from "@/hooks/use-param-id";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/client/use-workspace-get-info";
import { WorkspaceJoinForm } from "@/features/workspaces/components/forms/workspace-join-form";

export const WorkspaceIdJoinClient = () => {
  const workspaceId = useParamId("workspaceId");
  const { data: initialValues, isLoading } = useGetWorkspaceInfo({
    workspaceId,
  });

  if (isLoading) return "loading";
  
  if (!initialValues) return "workspace not found";

  return (
    <div className="w-full lg:max-w-xl">
      <WorkspaceJoinForm initialValues={initialValues as Workspace} />
    </div>
  );
};
