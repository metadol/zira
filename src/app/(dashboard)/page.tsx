import { authGuard } from "@/features/auth/utils";
import { getWorkspaces } from "@/features/workspaces/utils";
import { redirect } from "next/navigation";

const HomePage = async () => {
  await authGuard("protected");

  const workspaces = await getWorkspaces();
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}

export default HomePage

// asdf@r.com
