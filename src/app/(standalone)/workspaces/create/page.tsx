import { CreateWorkspaceForm } from "@/features/workspaces/components/forms/workspace-create-form";
import { authGuard } from "@/features/auth/utils";

export const metadata = {
  title: "Create Workspace",
};

const createWorkSpacePage = async () => {
  await authGuard("protected");

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default createWorkSpacePage;
