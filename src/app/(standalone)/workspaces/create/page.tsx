import { authGuard } from "@/features/auth/utils";
import { CreateWorkspaceForm } from "@/features/workspaces/components/workspace-create-form";

const createWorkSpacePage = async () => {
  await authGuard("protected");

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default createWorkSpacePage;
