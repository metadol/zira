"use client";

import { useRouter } from "next/navigation";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { useJoinWorkspace } from "../../api/client/use-workspace-join";
import { useParamId } from "@/hooks/use-param-id";
import { useTransition } from "react";

interface WorkspaceJoinFormProps {
  initialValues: {
    name: string;
  };
}

export const WorkspaceJoinForm = ({
  initialValues,
}: WorkspaceJoinFormProps) => {
  const router = useRouter();
  const workspaceId = useParamId("workspaceId");
  const inviteCode = useParamId("inviteCode");

  const { mutate, isPending} = useJoinWorkspace();
  const [isRouting, startTransition] = useTransition();


  const handleJoinWorkspace = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          startTransition(() => {
            router.push(`/workspaces/${data.$id}`);
          });
        },
      }
    );
  };

  const isLoading = isPending || isRouting;

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{initialValues.name}</strong>{" "}
          workspace
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <div className="text-end">
          <Button
            size="lg"
            type="button"
            disabled={isLoading}
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
