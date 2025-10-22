import { UserButton } from "@/features/auth/components/user-button";
import { CreateWorkspaceForm } from "@/features/workspaces/components/workspace-create-form";
import { getCurrentUser } from "@/lib/auth";
import { authGuard } from "@/lib/auth-guard";
import { redirect } from "next/navigation";

export default async function Home() {
  await authGuard("protected");
  return (
    <div>
      This is the dashboard home page
      <div className="bg-purple-500 p-4">
        <CreateWorkspaceForm />
      </div>
    </div>
  );
}

// asdf@r.com
