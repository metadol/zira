"use client";

// import { PageError } from '@/components/page-error';
// import { PageLoader } from '@/components/page-loader';
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { MembersListForm } from "@/features/members/components/members-list-form";
import { useGetMembers } from "@/features/members/api/client/use-members-get";

export const WorkspaceIdMembersClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading } = useGetMembers({
    workspaceId,
  });

  if (isLoading) return "loading";
  //   if (!initialValues) return <PageError message="Workspace not found." />;

  return (
    <div className="w-full lg:max-w-xl">
      <MembersListForm />
    </div>
  );
};
