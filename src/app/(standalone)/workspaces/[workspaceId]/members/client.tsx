"use client";

import { MembersListForm } from "@/features/members/components/members-list-form";
import { useGetMembers } from "@/features/members/api/client/use-members-get";
import { useParamId } from "@/hooks/use-param-id";

export const WorkspaceIdMembersClient = () => {
  const workspaceId = useParamId("workspaceId");
  const { data: initialValues, isLoading } = useGetMembers({
    workspaceId,
  });

  if (isLoading) return "loading";

  if (!initialValues) return "members not found";

  return (
    <div className="w-full lg:max-w-xl">
      <MembersListForm />
    </div>
  );
};
