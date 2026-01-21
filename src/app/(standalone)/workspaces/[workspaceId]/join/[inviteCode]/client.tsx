"use client";

// import { PageError } from '@/components/page-error';
// import { PageLoader } from '@/components/page-loader';
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/client/use-workspace-get-info";

import { WorkspaceJoinForm } from "@/features/workspaces/components/forms/workspace-join-form";

import { Workspace } from "@/types";

export const WorkspaceIdJoinClient = () => {
  const workspaceId = useParamId("workspaceId");
  const { data: initialValues, isLoading } = useGetWorkspaceInfo({
    workspaceId,
  });

  if (isLoading) return "loading";
  //   if (!initialValues) return <PageError message="Workspace not found." />;

  return (
    <div className="w-full lg:max-w-xl">
      <WorkspaceJoinForm initialValues={initialValues as Workspace} />
    </div>
  );
};
