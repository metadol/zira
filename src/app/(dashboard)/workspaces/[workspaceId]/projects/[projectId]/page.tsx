import { authGuard } from "@/features/auth/utils";

const ProjectPage = async () => {
  await authGuard("protected");

  return <div className="flex flex-col">Projec id</div>;
};

export default ProjectPage;
