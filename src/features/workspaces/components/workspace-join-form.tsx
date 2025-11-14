"use client";

// Libraries
import Link from "next/link";
import { useRouter } from "next/navigation";

// Components
import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Utils / Schemas / Hooks
import { useInviteCode } from "@/hooks/use-invite-code";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useJoinWorkspace } from "../api/client/use-workspace-join";

interface WorkspaceJoinFormProps {
  initialValues: {
    name: string;
  };
}

export const WorkspaceJoinForm = ({
  initialValues,
}: WorkspaceJoinFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();

  const { mutate, isPending } = useJoinWorkspace();

  const handleJoinWorkspace = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You've been invited to join <strong>{initialValues.name}</strong>
          workspace
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <div className="flex flex-col-reverse xs:flex-row gap-y-2 items-center justify-between">
          <Button
            variant="secondary"
            size="lg"
            type="button"
            disabled={isPending}
            className={"w-full xs:w-auto"}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            size="lg"
            type="button"
            disabled={isPending}
            className="w-full xs:w-auto"
            onClick={handleJoinWorkspace}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
