import { ProjectIdClient } from "@/components/project-id-client";
import { authGuard } from "@/features/auth/utils";

const ProjectPage = async () => {
  await authGuard("protected");
  return <ProjectIdClient />;
};

export default ProjectPage;
