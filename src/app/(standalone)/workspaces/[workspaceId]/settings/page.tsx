import { WorkspaceIdSettingsClient } from "./client";
import { authGuard } from "@/features/auth/utils";

export const metadata = {
  title: "Workspace Settings",
};
const WorkSpaceIdSettingsPage = async () => {
  await authGuard("protected");
  return <WorkspaceIdSettingsClient />;
};

export default WorkSpaceIdSettingsPage;
