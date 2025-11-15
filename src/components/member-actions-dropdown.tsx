"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { Member, MemberRole } from "@/types";
import { getMemberPermissions } from "@/features/members/utils";

export interface MemberActionsDropdownProps {
  user: Member;
  member: Member;
  onUpdate: (role: MemberRole) => void;
  onDelete: () => void;
  isDisabled?: boolean;
  isLoggedInAdmin: boolean;
}

export function MemberActionsDropdown({
  user,
  member,
  onUpdate,
  onDelete,
  isDisabled,
  isLoggedInAdmin,
}: MemberActionsDropdownProps) {
  const { canSetAdmin, canSetMember, canRemove } = getMemberPermissions({
    user,
    member,
    isLoggedInAdmin,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isDisabled || !canRemove}>
        <Button className="ml-auto" variant="secondary" size="icon">
          <MoreVerticalIcon className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end">
        {canSetAdmin && (
          <DropdownMenuItem
            className="font-medium"
            onClick={() => onUpdate(MemberRole.ADMIN)}
          >
            Set as Admin
          </DropdownMenuItem>
        )}

        {canSetMember && (
          <DropdownMenuItem
            className="font-medium"
            onClick={() => onUpdate(MemberRole.MEMBER)}
          >
            Set as Member
          </DropdownMenuItem>
        )}

        {canRemove && (
          <DropdownMenuItem
            className="font-medium text-amber-700"
            onClick={onDelete}
          >
            Remove {member.name}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
