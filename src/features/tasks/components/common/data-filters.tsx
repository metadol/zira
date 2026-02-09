import { TaskStatus } from "@/types";
import { useParamId } from "@/hooks/use-param-id";
import { Folder, ListChecks, UserIcon } from "lucide-react";
import { useTaskFilters } from "../../hooks/use-task-filters";
import { DatePicker } from "@/components/common/widgets/date-picker";
import { FilterSelect } from "@/components/common/forms/filter-select";
import { useGetMembers } from "@/features/members/api/client/use-members-get";
import { useGetProjects } from "@/features/projects/api/client/use-projects-get";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useParamId("workspaceId");
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });
  const isLoading = isLoadingProjects || isLoadingMembers;

  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters();

  const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "BACKLOG", label: "Backlog" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "IN_REVIEW", label: "In Review" },
    { value: "TODO", label: "Todo" },
    { value: "DONE", label: "Done" },
  ];

  const memberOptions = [
    { value: "all", label: "All assignees" },
    ...(members?.documents.map((member) => ({
      value: member.$id,
      label: member.name,
    })) || []),
  ];

  const projectOptions = [
    { value: "all", label: "All projects" },
    ...(projects?.documents.map((project) => ({
      value: project.$id,
      label: project.name,
    })) || []),
  ];

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };

  if (isLoading) return "loading...";

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <FilterSelect
        value={status || "all"}
        onValueChange={onStatusChange}
        options={statusOptions}
        placeholder="Select status"
        icon={<ListChecks className="size-4" />}
      />

      <FilterSelect
        value={assigneeId || "all"}
        onValueChange={onAssigneeChange}
        options={memberOptions}
        placeholder="Select assignee"
        icon={<UserIcon className="size-4" />}
      />

      {!hideProjectFilter && (
        <FilterSelect
          value={projectId || "all"}
          onValueChange={onProjectChange}
          options={projectOptions}
          placeholder="Select project"
          icon={<Folder className="size-4" />}
        />
      )}

      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : new Date()}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
        showReset
      />
    </div>
  );
};
