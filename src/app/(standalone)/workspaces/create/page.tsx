import { CreateWorkspaceForm } from "@/features/workspaces/components/workspace-create-form";
import { authGuard } from "@/lib/auth-guard";

const createWorkSpacePage = async () => {
  await authGuard("protected");

  return (
    <div className="w-full lg:max-w-xl py-8">
      <CreateWorkspaceForm />
    </div>
  );
};

export default createWorkSpacePage;
