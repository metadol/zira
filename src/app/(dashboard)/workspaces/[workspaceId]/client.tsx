"use client"

import { useParamId } from "@/hooks/use-param-id";
import { useParamModal } from "@/hooks/use-param-modal";

import { Analytics } from "@/features/projects/components/common/analytics";

import { useGetTasks } from "@/features/tasks/api/client/use-tasks-get";
import { useGetMembers } from "@/features/members/api/client/use-members-get";
import { useGetProjects } from "@/features/projects/api/client/use-projects-get";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/client/use-workspace-get-analytics";



export const WorkspaceIdClient = () => {
    const workspaceId = useParamId("workspaceId");

    const {
        data: tasks,
        isLoading: isTasksLoading,
    } = useGetTasks({ workspaceId });

    const {
        data: projects,
        isLoading: isProjectsLoading,
    } = useGetProjects({ workspaceId });

    const {
        data: members,
        isLoading: isMembersLoading,
    } = useGetMembers({ workspaceId });

    const {
        data: analytics,
        isLoading: isAnalyticsLoading,
    } = useGetWorkspaceAnalytics({ workspaceId });


    const { open: createTaskModal } = useParamModal("create-task");
    const { open: createProjectModal } = useParamModal("create-project");

    const isLoading =
        isTasksLoading ||
        isProjectsLoading ||
        isMembersLoading ||
        isAnalyticsLoading;

    if (isLoading) {
        return <div>Loading workspace data...</div>;
    }

    if (!analytics || !projects || !members || !tasks) {
        return <div>Failed to load workspace data.</div>;
    }

    return (
        <div className="h-full flex flex-col space-y-4">
            <Analytics data={analytics} />
        </div>
    )
};
