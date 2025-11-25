"use client";

import { useGetProjects } from "@/features/projects/api/client/use-projects-get";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddFill } from "react-icons/ri";

export const Projects = () => {
  const projectId = null;
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddFill
          onClick={() => {}}
          className="size-5 text-neutral-500 cursor-pointer"
        />
      </div>
      {data?.documents?.map((project) => {
        const fullHref = `/workspaces/${workspaceId}/projects/${projectId}`;
        const isActive = pathname === fullHref;
        return (
          <Link href={fullHref} key={project.$id}>
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-md p-2.5 font-medium text-neutral-500 transition hover:opacity-75",
                isActive && "bg-white text-primary shadow-sm hover:opacity-100"
              )}
            >
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
