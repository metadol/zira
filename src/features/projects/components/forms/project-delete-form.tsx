"use client";

//  Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";

//  Utils / Schemas / Hooks
import { type Project } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteProject } from "../../api/client/use-project-delete";

export function ProjectDangerZone({ project }: { project: Project }) {
  const { mutate, isPending } = useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Delete Project",
    message:
      "Are you sure you want to delete this project? This action cannot be undone.",
    variant: "destructive",
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    mutate(
      { param: { projectId: project.$id } },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  return (
    <Card className="border-none shadow-none">
      <DeleteDialog />
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Deleting a project is irreversible and will remove all associated
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
            Delete Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
