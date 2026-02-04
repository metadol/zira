import { authGuard } from "@/features/auth/utils";
import { WorkspaceIdClient } from "./client";

const WorkspacePage = async () => {
  await authGuard("protected");

  return <WorkspaceIdClient />;
};

export default WorkspacePage;
