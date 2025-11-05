'use server';

import { type Models, Query } from 'node-appwrite';
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from '../../config';
import { createSessionClient } from '@/lib/appwrite';

// to use in server components
export const getWorkspaces = async () => {
    try {
        const { account, databases, storage } = await createSessionClient();
        const user = await account.get();

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal('userid', user.$id)]
        );

        if (members.total === 0) {
            return { documents: [], total: 0 };
        }

        const workspaceIds = members.documents.map((member) => member.workspaceid);
        if (workspaceIds.length === 0) {
            return { documents: [], total: 0 };
        }

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID,
            [Query.orderDesc('$createdAt'), Query.equal('$id', workspaceIds)]
        );

        const workspacesWithImages: Models.Document[] = await Promise.all(
            workspaces.documents.map(async (workspace) => {
                let image: string | undefined;

                if (workspace.image) {
                    try {
                        const imageUrl = storage.getFileView(IMAGES_BUCKET_ID, workspace.image);
                        image = typeof imageUrl === 'string' ? imageUrl : '';
                    } catch (error) {
                        console.error(`[getWorkspaces] Error fetching image for workspace ${workspace.$id}:`, error);
                    }
                }

                return { ...workspace, image };
            })
        );

        return { documents: workspacesWithImages, total: workspaces.total };
    } catch (error) {
        console.error('[getWorkspaces] Major error:', error);
        return { documents: [], total: 0 };
    }
};
