"use client";

import { type Workspace } from "@/types";
import { WorkspaceUpdateForm } from "../forms/workspace-update-form";
import { WorkspaceDangerZone } from "../forms/workspace-delete-form";
import { WorkspaceInviteSection } from "../forms/workspace-invite-form";

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
