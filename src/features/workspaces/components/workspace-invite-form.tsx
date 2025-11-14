"use client";

// 1️⃣ Libraries
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

// 2️⃣ Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DottedSeparator } from "@/components/dotted-seperator";

// 3️⃣ Utils / Schemas / Hooks
import { useConfirm } from "@/hooks/use-confirm";
import { useResetInviteCode } from "../api/client/use-reset-invite-code";
import { type Workspace } from "@/types";

export function WorkspaceInviteSection({
  workspace,
}: {
  workspace: Workspace;
}) {
  const { mutate, isPending } = useResetInviteCode();
  const [ResetDialog, confirmReset] = useConfirm({
    title: "Reset Invite Link",
    message:
      "Are you sure you want to reset the invite link? The previous link will no longer work.",
    variant: "destructive",
  });

  const fullInviteLink = `${window.location.origin}/workspaces/${workspace.$id}/join/${workspace.invitecode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;

    mutate(
      { param: { workspaceId: workspace.$id } },
      { onSuccess: () => toast.success("Invite code reset") }
    );
  };

  return (
    <Card className="border-none shadow-none">
      <ResetDialog />
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Invite Members</h3>
          <p className="text-sm text-muted-foreground">
            Use the invite link to add members to your workspace.
          </p>
          <div className="mt-4">
            <div className="flex items-center gap-x-2">
              <Input disabled value={fullInviteLink} className="flex-1" />
              <Button
                onClick={handleCopyInviteLink}
                variant="secondary"
                className="size-12"
              >
                <CopyIcon className="size-5" />
              </Button>
            </div>
          </div>

          <DottedSeparator className="py-7" />

          <Button
            className="mt-6 w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            disabled={isPending}
            onClick={handleResetInviteCode}
          >
            Reset Invite Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
