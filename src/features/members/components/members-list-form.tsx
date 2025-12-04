"use client";

import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ArrowLeftIcon, MoreVerticalIcon, Shield } from "lucide-react";
import Link from "next/link";
import { useGetMembers } from "../api/client/use-members-get";
import { Fragment } from "react";
import { useUpdateMember } from "../api/client/use-member-update";
import { useDeleteMember } from "../api/client/use-member-delete";
import { Member, MemberRole } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { useCurrent } from "@/features/auth/api/client/use-current";
import { MemberActionsDropdown } from "@/features/members/components/member-actions-dropdown";
import { hasAdminRole } from "../utils";
import { UserAvatar } from "@/components/common/widgets/user-avatar";

export const MembersListForm = () => {
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrent();
  const { data: members } = useGetMembers({ workspaceId });

  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Remove Member",
    message:
      "Are you sure you want to remove this member from the workspace? This action cannot be undone.",
    variant: "destructive",
  });

  const handleUpateMemeber = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  const isDisabled =
    isDeletingMember || isUpdatingMember || members?.documents.length === 1;

  const isLoggedInAdmin = hasAdminRole({
    user: user ?? ({} as Member),
    members: members?.documents || [],
  });

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DeleteDialog />
      <CardHeader className="flex flex-row items-center p-7 gap-x-4 space-y-0">
        <Button asChild size="sm" variant="secondary">
          <Link href="/workspaces">
            <ArrowLeftIcon className="size-4 mr-1" />
            <span className="hidden xs:block">Back</span>
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members List</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {members?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <UserAvatar name={member.name} />

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium">{member.name}</p>
                  {(member as Member).role === MemberRole.ADMIN && (
                    <Shield className="size-3.5" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>

              <MemberActionsDropdown
                user={user!}
                member={member}
                isDisabled={isDisabled}
                isLoggedInAdmin={isLoggedInAdmin}
                onUpdate={(role) => handleUpateMemeber(member.$id, role)}
                onDelete={() => handleDeleteMember(member.$id)}
              />
            </div>

            {index < members.documents.length - 1 && <div className="my-5" />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
