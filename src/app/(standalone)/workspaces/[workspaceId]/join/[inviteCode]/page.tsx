import { WorkspaceIdJoinClient } from "./client";
import { authGuard } from "@/features/auth/utils";

export const metadata = {
  title: "Join Workspace",
};

const WorkSpaceIdJoinPage = async () => {
  await authGuard("protected");
  return <WorkspaceIdJoinClient />;
};

export default WorkSpaceIdJoinPage;
