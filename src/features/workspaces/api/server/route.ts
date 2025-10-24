import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createWorkspaceSchema } from '../../schemas';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { ID, type Models, Query } from 'node-appwrite';
import { generateInviteCode } from '@/lib/utils';

const app = new Hono()
    .post('/', zValidator('form', createWorkspaceSchema), sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const storage = c.get('storage');
        const user = c.get('user');

        const { name, image } = c.req.valid('form');

        let uploadedImageId: string | undefined = undefined;

        // If the image is a File object, upload it
        if (image instanceof File) {
            const fileExt = image.name.split('.').at(-1) ?? 'png';
            const fileName = `${ID.unique()}.${fileExt}`;

            const renamedImage = new File([image], fileName, {
                type: image.type,
            });

            const file = await storage.createFile(
                IMAGES_BUCKET_ID,
                ID.unique(),
                renamedImage
            );

            uploadedImageId = file.$id;
        } else if (typeof image === 'string') {
            // If it's already a file ID, just use it
            uploadedImageId = image;
        }

        // Create the workspace document to the workspaces collection
        const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            ID.unique(),
            {
                name,
                userid: user.$id,
                image: uploadedImageId,
                invitecode: generateInviteCode(6),
            }
        );

        // Add the user as a member of the workspace to the members collection
        await databases.createDocument(
            DATABASE_ID,
            MEMBERS_ID,
            ID.unique(),
            {
                workspaceid: workspace.$id,
                userid: user.$id,
                role: 'ADMIN',
            }
        );

        // Return the workspace
        return c.json({ data: workspace });
    }
    )

    .get('/', sessionMiddleware, async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');
        const storage = c.get('storage');

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal('userid', user.$id)]
        );

        // If the user is not a member of any workspace, return an empty array
        if (members.total === 0) {
            return c.json({
                data: {
                    documents: [],
                    total: 0,
                },
            });
        }

        // Get the IDs of the workspaces that the user is a member of and fetch them
        const workspaceIds = members.documents.map((member) => member.workspaceid);

        // Fetch workspaces
        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID,
            [
                Query.orderDesc('$createdAt'),
                Query.contains('$id', workspaceIds) // Fetch only workspaces where the ID is in the workspaceIds array
            ]
        );

        const workspacesWithImages: Models.Document[] = await Promise.all(
            workspaces.documents.map(async (workspace) => {
                let image: string | undefined = undefined;

                if (workspace.image) {
                    try {
                        const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, workspace.image);
                        image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
                    } catch (error) {
                        console.error(`Error fetching image for workspace ${workspace.$id}:`, error);
                    }
                }

                return { ...workspace, image };
            })
        );

        return c.json({
            data: {
                documents: workspacesWithImages,
                total: workspaces.total,
            },
        });
    });






export default app;