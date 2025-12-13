import { type Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  image?: string;
  userid: string;
  inviteCode: string;
};

export type Project = Models.Document & {
  name: string;
  image?: string;
  workspaceid: string;
};

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface Member {
  $id: string;
  userid?: string;
  role?: MemberRole;
  name?: string;
}

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  assigneeId: string;
  projectId: string;
  workspaceId: string;
  position: number;
  dueDate: string;
  description?: string;
};