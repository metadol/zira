import { WorkspaceIdMembersClient } from "@/components/workspace-members-client";
import { authGuard } from "@/features/auth/utils";

const WorkspaceIdMembersPage = async () => {
  await authGuard("protected");
  return <WorkspaceIdMembersClient />;
};
export default WorkspaceIdMembersPage;
