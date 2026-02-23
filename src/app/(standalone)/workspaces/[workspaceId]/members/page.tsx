import { WorkspaceIdMembersClient } from "./client";
import { authGuard } from "@/features/auth/utils";

export const metadata = {
  title: "Workspace Members",
};

const WorkspaceIdMembersPage = async () => {
  await authGuard("protected");
  return <WorkspaceIdMembersClient />;
};
export default WorkspaceIdMembersPage;
