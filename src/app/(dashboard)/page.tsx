import { authGuard } from "@/lib/auth-guard";
import { getWorkspaces } from "@/lib/workspace";
import { redirect } from "next/navigation";

export default async function Home() {
  await authGuard("protected");

  const workspaces = await getWorkspaces();
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}

// asdf@r.com
