"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/common/project-avatar";

import { useGetProjectById } from "@/features/projects/api/client/use-project-get-id";
import { TaskViewSwitcher } from "@/features/tasks/components/switcher/task-view-switcher";
import { useParamId } from "@/hooks/use-param-id";
import { useGetProjectAnalytics } from "@/features/projects/api/client/use-projects-get-analytics";
import { Analytics } from "@/features/projects/components/common/analytics";

export const ProjectIdClient = () => {
  const projectId = useParamId("projectId");

  const {
    data: project,
    isLoading: isProjectLoading,
  } = useGetProjectById({ projectId });

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
  } = useGetProjectAnalytics({ projectId });

  const isLoading = isProjectLoading || isAnalyticsLoading;

  if (isLoading) return "loading";
  
  if (!project) return "project not found";

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
              <Pencil className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {analytics && <Analytics data={analytics} />}

      <TaskViewSwitcher hideProjectFilter/>

      {/* {analytics && <Analytics data={projectAnalytics} />} */}

      {/* <TaskViewSwitcher projectId={projectId} hideProjectFilter /> */}
    </div>
  );
};
