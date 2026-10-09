"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { RiAddFill } from "react-icons/ri";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { usePathname } from "next/navigation";
import { useParamId } from "@/hooks/use-param-id";
import { useParamModal } from "@/hooks/use-param-modal";
import { useProjectOrder } from "@/features/projects/hooks/use-project-order";
import { useGetProjects } from "@/features/projects/api/client/use-projects-get";
import { ProjectAvatar } from "@/features/projects/components/common/project-avatar";

export const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useParamId("workspaceId");
  const { open } = useParamModal("create-project");
  const { data } = useGetProjects({ workspaceId });

  const { items: projects, reorder } = useProjectOrder(
    data?.documents,
    `project-order-${workspaceId}`,
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorder(result.source.index, result.destination.index);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer"
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-y-2"
            >
              {projects.map((project, index) => {
                const fullHref = `/workspaces/${workspaceId}/projects/${project.$id}`;
                const isActive = pathname === fullHref;
                return (
                  <Draggable
                    key={project.$id}
                    draggableId={project.$id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Link href={fullHref}>
                          <div
                            className={cn(
                              "flex items-center gap-2.5 rounded-md p-2.5 font-medium text-neutral-500 transition hover:opacity-75",
                              isActive &&
                                "bg-white text-primary shadow-sm hover:opacity-100",
                            )}
                          >
                            <ProjectAvatar
                              image={project.image}
                              name={project.name}
                            />
                            <span className="truncate">{project.name}</span>
                          </div>
                        </Link>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
