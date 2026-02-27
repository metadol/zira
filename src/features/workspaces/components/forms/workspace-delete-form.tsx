"use client";

//  Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";

//  Utils / Schemas / Hooks
import { type Workspace } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../../api/client/use-workspace-delete";

export function WorkspaceDangerZone({ workspace }: { workspace: Workspace }) {
  const { mutate, isPending } = useDeleteWorkspace();

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Delete Workspace",
    message:
      "Are you sure you want to delete this workspace? This action cannot be undone.",
    variant: "destructive",
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    mutate(
      { param: { workspaceId: workspace.$id } },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    );
  };

  return (
    <Card className="border-none shadow-none">
      <DeleteDialog />
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Deleting a workspace is irreversible and will remove all associated
            data.
          </p>

          <DottedSeparator className="py-7" />

          <Button
            className="mt-6 w-full xs:w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            Delete Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
