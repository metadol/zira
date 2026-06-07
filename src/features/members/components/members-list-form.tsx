"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";

import { hasAdminRole } from "../utils";
import { Member, MemberRole } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { useParamId } from "@/hooks/use-param-id";
import { useGetMembers } from "../api/client/use-members-get";
import { useUpdateMember } from "../api/client/use-member-update";
import { useDeleteMember } from "../api/client/use-member-delete";
import { UserAvatar } from "@/components/common/widgets/user-avatar";
import { useCurrent } from "@/features/auth/api/client/use-current";
import { MemberActionsDropdown } from "@/features/members/components/member-actions-dropdown";

export const MembersListForm = () => {
  const workspaceId = useParamId("workspaceId");
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

  const handleDeleteMember = async (member: Member) => {
    const ok = await confirmDelete();
    if (!ok) return;

    const memberId = member?.$id;
    const isCurrentUser = user?.$id === member?.userid;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          if (isCurrentUser) {
            window.location.href = "/";
          } else {
            window.location.reload();
          }
        },
      },
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
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-1" />
            <span className="hidden xs:block">Back</span>
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold truncate min-w-0">
          Members List
        </CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {members?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2 min-w-0">
              <UserAvatar name={member.name} />

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium">{member.name}</p>
                  {(member as Member).role === MemberRole.ADMIN && (
                    <Shield className="size-3.5" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {member.email}
                </p>
              </div>

              <MemberActionsDropdown
                user={user!}
                member={member}
                isDisabled={isDisabled}
                isLoggedInAdmin={isLoggedInAdmin}
                onDelete={() => handleDeleteMember(member)}
                onUpdate={(role) => handleUpateMemeber(member.$id, role)}
              />
            </div>

            {index < members.documents.length - 1 && <div className="my-5" />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
