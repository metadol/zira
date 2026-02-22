"use client"

import { useParamId } from "@/hooks/use-param-id";

import { Analytics } from "@/features/projects/components/common/analytics";
import { TaskViewSwitcher } from "@/features/tasks/components/switcher/task-view-switcher";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/client/use-workspace-get-analytics";
import { LoadingLogo } from "@/components/common/widgets/loading";

export const WorkspaceIdClient = () => {
    const workspaceId = useParamId("workspaceId");

    const {
        data: analytics,
        isLoading: isAnalyticsLoading,
    } = useGetWorkspaceAnalytics({ workspaceId });


    if (isAnalyticsLoading) {
        return <LoadingLogo />;
    }

    if (!analytics) {
        return <div>Failed to load workspace data.</div>;
    }

    return (
        <div className="h-full flex flex-col space-y-4">
            <Analytics data={analytics} />
            <TaskViewSwitcher />
        </div>
    )
};
