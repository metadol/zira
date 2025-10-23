import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createWorkspaceSchema } from '../../schemas';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from '@/config';
import { ID, type Models, Query } from 'node-appwrite';

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

        // Create the workspace
        const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            ID.unique(),
            {
                name,
                userid: user.$id,
                image: uploadedImageId,
            }
        );

        // Return the workspace
        return c.json({ data: workspace });
    }
    )

    .get('/', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const storage = c.get('storage');

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID
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