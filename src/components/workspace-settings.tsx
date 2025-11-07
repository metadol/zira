"use client";

// import { PageError } from "@/components/page-error";
// import { PageLoader } from "@/components/page-loader";

import { useGetWorkspaceById } from "@/features/workspaces/api/client/use-workspace-get-id";
import {
  UpdateWorkspaceForm,
  Workspace,
} from "@/features/workspaces/components/workspace-update-form";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const WorkspaceIdSettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading } = useGetWorkspaceById({
    workspaceId,
  });

    if (isLoading) {
      // return <PageLoader />;
      return "loading"
    }

  //   if (!initialValues) {
  //     return <PageError message="Workspace not found." />;
  //   }

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm
        initialValues={initialValues as Workspace}
      />
    </div>
  );
};
