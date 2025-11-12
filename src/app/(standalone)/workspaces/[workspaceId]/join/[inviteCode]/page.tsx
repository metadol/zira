import { WorkspaceIdJoinClient } from "@/components/workspace-join-client";
import { authGuard } from "@/features/auth/utils";

const WorkSpaceIdJoinPage = async () => {
  await authGuard("protected");
  return <WorkspaceIdJoinClient />;
};

export default WorkSpaceIdJoinPage;
