import { type Databases, Query } from 'node-appwrite';

import { DATABASE_ID, MEMBERS_ID } from '@/config';
import { Member, MemberRole } from '@/types';

interface GetMemberProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

interface getMemberPermissionsProps {
  user: Member;
  member: Member;
  isLoggedInAdmin: boolean;
}

interface hasAdminRoleProps {
  user: Member;
  members: Member[];
}



export const getMember = async ({ databases, workspaceId, userId }: GetMemberProps) => {
  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal('workspaceid', workspaceId),
    Query.equal('userid', userId),
  ]);

  return members.documents[0];
};

export function getMemberPermissions({ user, member, isLoggedInAdmin, }: getMemberPermissionsProps) {
  const isCurrentUser = user?.$id === member?.userid;
  return {
    canSetAdmin: isLoggedInAdmin && !isCurrentUser && member.role !== MemberRole.ADMIN,
    canSetMember: isLoggedInAdmin && !isCurrentUser && member.role !== MemberRole.MEMBER,
    canRemove: !isLoggedInAdmin && isCurrentUser,
  };
}

export const hasAdminRole = ({ user, members }: hasAdminRoleProps): boolean => {
  return members.some((member) => member.userid === user.$id && member.role === MemberRole.ADMIN);
};
