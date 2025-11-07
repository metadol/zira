import { WorkspaceIdSettingsClient } from "@/components/workspace-settings";
import { authGuard } from "@/features/auth/utils";

const WorkSpaceIdSettingsPage = async () => {
  await authGuard("protected");

  return <WorkspaceIdSettingsClient />;
};

export default WorkSpaceIdSettingsPage;
