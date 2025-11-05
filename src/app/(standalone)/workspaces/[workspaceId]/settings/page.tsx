import { authGuard } from "@/features/auth/utils";

interface WorkSpaceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkSpaceIdSettingsPage = async ({
  params,
}: WorkSpaceIdSettingsPageProps) => {
  await authGuard("protected");

  return (
    <div>
      <div>WorkSpaceID SETTINGS {params.workspaceId}</div>
    </div>
  );
};

export default WorkSpaceIdSettingsPage;
