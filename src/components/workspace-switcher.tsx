"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/client/use-workpsace-get";
import { RiAddFill } from "react-icons/ri";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { WorkspaceAvatar } from "./workspace-avatar";

export const WorkspaceSwitcher = () => {
  const { data: workspaces } = useGetWorkspaces();

  console.log("workspaces", workspaces);
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddFill className="size-5 text-neutral-500 cursor-pointer" />
      </div>

      <Select>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1 data-[placeholder]:text-muted-foreground">
          <SelectValue
            placeholder="Select a workspace"
          />
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
