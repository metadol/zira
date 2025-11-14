import { type Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  image?: string;
  userid: string;
  inviteCode: string;
};

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}