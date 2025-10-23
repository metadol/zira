import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createWorkspaceSchema } from '../../schemas';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from '@/config';
import { ID, type Models, Query } from 'node-appwrite';


const app = new Hono()
    .post('/', zValidator('form', createWorkspaceSchema), sessionMiddleware, async (ctx) => {
        const databases = ctx.get('databases');
        const storage = ctx.get('storage');
        const user = ctx.get('user');

        const { name, image } = ctx.req.valid('form');

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
        return ctx.json({ data: workspace });
    }
    );


export default app;