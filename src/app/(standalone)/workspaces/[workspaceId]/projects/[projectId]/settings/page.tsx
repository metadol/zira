import { ProjectIdSettingsClient } from "./client";
import { authGuard } from "@/features/auth/utils";

export const metadata = {
  title: "Project Settings",
};

const ProjectIdSettingsPage = async () => {
  await authGuard("protected");
  return <ProjectIdSettingsClient />;
};

export default ProjectIdSettingsPage;
