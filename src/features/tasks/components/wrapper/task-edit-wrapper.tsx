import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/client/use-members-get";
import { useGetProjects } from "@/features/projects/api/client/use-projects-get";
import { CreateTaskForm } from "../forms/task-create-form";
import { TaskStatus } from "@/types";
import { useParamIdModal } from "@/hooks/use-param-id-modal";
import { useGetTaskById } from "../../api/client/use-task-get-id";
import { EditTaskForm } from "../forms/task-edit-form";

interface CreateTaskFormWrapperProps {
  id: string;
  onCancel: () => void;
}

export const EditTaskFormWrapper = ({
  id,
  onCancel,
}: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: task, isLoading: isLoadingTask } = useGetTaskById({
    taskId: id,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageurl: project.imageurl,
  }));

  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const statusOptions = [
    { id: TaskStatus.BACKLOG, name: "Backlog" },
    { id: TaskStatus.TODO, name: "Todo" },
    { id: TaskStatus.IN_PROGRESS, name: "In Progress" },
    { id: TaskStatus.IN_REVIEW, name: "In Review" },
    { id: TaskStatus.DONE, name: "Done" },
  ];

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <EditTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions}
      memberOptions={memberOptions}
      statusOptions={statusOptions}
      initialValues={task}
    />
  );
};
