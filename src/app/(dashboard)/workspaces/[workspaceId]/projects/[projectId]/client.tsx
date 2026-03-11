"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParamId } from "@/hooks/use-param-id";
import { LoadingLogo } from "@/components/common/widgets/loading";
import { Analytics } from "@/features/projects/components/common/analytics";
import { ProjectAvatar } from "@/features/projects/components/common/project-avatar";
import { useGetProjectById } from "@/features/projects/api/client/use-project-get-id";
import { TaskViewSwitcher } from "@/features/tasks/components/switcher/task-view-switcher";
import { useGetProjectAnalytics } from "@/features/projects/api/client/use-projects-get-analytics";


export const ProjectIdClient = () => {
  const projectId = useParamId("projectId");

  const { data: project, isLoading: isProjectLoading } = useGetProjectById({
    projectId,
  });

  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetProjectAnalytics({ projectId });

  const isLoading = isProjectLoading || isAnalyticsLoading;

  if (isLoading) {
    return <LoadingLogo />;
  }

  if (!project || !analytics) return "failed to load";

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.image}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>

        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${project.workspaceid}/projects/${project.$id}/settings`}
            >
              <Settings className="size-4 text-neutral-500" />
            </Link>
          </Button>
        </div>
      </div>

      <Analytics data={analytics} />
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
