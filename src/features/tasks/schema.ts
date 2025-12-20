import { z } from "zod";
import { TaskStatus } from "@/types";

export const createTaskSchema = z.object({
    name: z.string().min(1, "Task name is required."),
    status: z.enum(TaskStatus, "Status is required"),
    workspaceId: z.string("Workspace id is required"),
    projectId: z.string("Project is required"),
    assigneeId: z.string("Assignee is required"),
    dueDate: z.coerce.date("Due date is required"),
    description: z.string().optional(),
});