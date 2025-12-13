import { z } from "zod";
import { TaskStatus } from "@/types";

export const createTaskSchema = z.object({
    name: z.string().min(1, "Task name is required."),
    status: z.enum(TaskStatus),
    workspaceId: z.string().min(1, "Workspace id is required."),
    projectId: z.string().min(1, "Project id is required."),
    dueDate: z.coerce.date(),
    assigneeId: z.string().min(1, "Assignee id is required."),
    description: z.string().optional(),
});
