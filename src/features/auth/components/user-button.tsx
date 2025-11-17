"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/dotted-seperator";

import { useLogout } from "../api/client/use-logout";
import { useCurrent } from "../api/client/use-current";
import { Loader, LogOut } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";

export const UserButton = () => {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout, isPending } = useLogout();

  if (isLoading) {
    return (
      <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
        <Loader className="animate-spin size-4 text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const { name, email } = user;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        disabled={isPending}
        className="relative rounded-full outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <UserAvatar name={name} email={email} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <UserAvatar name={name} email={email} />

          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {name || "User"}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>

        <DottedSeparator className="mb-1" />

        <DropdownMenuItem
          disabled={isPending}
          onClick={() => logout()}
          className="flex h-10 cursor-pointer items-center justify-center font-medium text-amber-700"
        >
          <LogOut className="mr-2 size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
