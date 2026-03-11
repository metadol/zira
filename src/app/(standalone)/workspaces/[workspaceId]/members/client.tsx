"use client";

import { MembersListForm } from "@/features/members/components/members-list-form";
import { useGetMembers } from "@/features/members/api/client/use-members-get";
import { useParamId } from "@/hooks/use-param-id";
import { LoadingLogo } from "@/components/common/widgets/loading";

export const WorkspaceIdMembersClient = () => {
  const workspaceId = useParamId("workspaceId");
  const { data: initialValues, isLoading } = useGetMembers({
    workspaceId,
  });

  if (isLoading) return <LoadingLogo />;

  if (!initialValues) return "members not found";

  return <MembersListForm />;
};
