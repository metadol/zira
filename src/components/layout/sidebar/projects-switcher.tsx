"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { RiAddFill } from "react-icons/ri";

import { usePathname } from "next/navigation";
import { useParamModal } from "@/hooks/use-param-modal";
import { useGetProjects } from "@/features/projects/api/client/use-projects-get";
import { ProjectAvatar } from "@/features/projects/components/common/project-avatar";
import { useParamId } from "@/hooks/use-param-id";

export const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useParamId("workspaceId");
  const { open } = useParamModal("create-project");
  const { data } = useGetProjects({ workspaceId });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer"
        />
      </div>

      {data?.documents?.map((project) => {
        const fullHref = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === fullHref;
        return (
          <Link href={fullHref} key={project.$id}>
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-md p-2.5 font-medium text-neutral-500 transition hover:opacity-75",
                isActive && "bg-white text-primary shadow-sm hover:opacity-100"
              )}
            >
              <ProjectAvatar image={project.image} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
