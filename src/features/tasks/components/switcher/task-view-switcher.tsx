"use client";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParamModal } from "@/hooks/use-param-modal";
import { PlusIcon } from "lucide-react";
import { useGetTasks } from "../../api/client/use-tasks-get";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useQueryState } from "nuqs";
import { DataFilters } from "../common/data-filters";
import { useTaskFilters } from "../../hooks/use-task-filters";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { DataKanban } from "./kanban/data-kanban";

export const TaskViewSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const { open } = useParamModal("create-task");
  const [view, setView] = useQueryState("view", { defaultValue: "table" });

  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId,
    dueDate,
  });
  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>

          <Button size={"sm"} className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          "loading..."
        ) : (
          <>
            <TabsContent value="table">
              <DataTable data={tasks?.documents ?? []} columns={columns} />
            </TabsContent>
            <TabsContent value="kanban">
              <DataKanban data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="calender">Calender</TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
