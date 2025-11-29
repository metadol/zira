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


