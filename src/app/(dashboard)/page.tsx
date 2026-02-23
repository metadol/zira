import { authGuard } from "@/features/auth/utils";
import { redirect } from "next/navigation";
import { getWorkspaces } from "@/features/workspaces/utils";

//“do not try to prerender this page at build time.render it on every request instead.”
export const dynamic = "force-dynamic";


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
