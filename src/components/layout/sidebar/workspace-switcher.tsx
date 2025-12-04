"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/client/use-workpsaces-get";
import { RiAddFill } from "react-icons/ri";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { WorkspaceAvatar } from "../../../features/workspaces/components/common/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useParamModal } from "@/hooks/use-param-modal";

export const WorkspaceSwitcher = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const { open } = useParamModal("create-workspace");
  const { data: workspaces, isLoading } = useGetWorkspaces();

  const onSelect = (Id: string) => {
    router.push(`/workspaces/${Id}`);
  };
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer"
        />
      </div>

      <Select onValueChange={onSelect} value={workspaceId} disabled={isLoading}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1 data-[placeholder]:text-muted-foreground">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {workspaces?.documents?.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.image}
                  className="flex-shrink-0"
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
