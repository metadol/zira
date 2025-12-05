import { ProjectIdSettingsClient } from "./client";
import { authGuard } from "@/features/auth/utils";

const ProjectIdSettingsPage = async () => {
  await authGuard("protected");
  return <ProjectIdSettingsClient />;
};

export default ProjectIdSettingsPage;
