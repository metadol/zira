"use client";

import { type Workspace } from "@/types";

import { WorkspaceUpdateForm } from "@/features/workspaces/components/workspace-update-form";
import { WorkspaceDangerZone } from "@/features/workspaces/components/workspace-delete-form";
import { WorkspaceInviteSection } from "@/features/workspaces/components/workspace-invite-form";

interface WorkspaceSettingsProps {
  workspace: Workspace;
}

export function WorkspaceSettings({ workspace }: WorkspaceSettingsProps) {
  return (
    <div className="flex flex-col gap-y-6">
      <WorkspaceUpdateForm initialValues={workspace} />
      <WorkspaceInviteSection workspace={workspace} />
      <WorkspaceDangerZone workspace={workspace} />
    </div>
  );
}
