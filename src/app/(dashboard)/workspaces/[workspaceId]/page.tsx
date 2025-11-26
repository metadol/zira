import { authGuard } from "@/features/auth/utils";

const WorkspacePage = async () => {
  await authGuard("protected");

  return <div className="flex flex-col">workpace id</div>;
};

export default WorkspacePage;
