import { ProjectIdClient } from "./client";
import { authGuard } from "@/features/auth/utils";

const ProjectPage = async () => {
  await authGuard("protected");
  return <ProjectIdClient />;
};

export default ProjectPage;
