import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Project } from "@/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import z from "zod";
import { createProjectSchema, updateProjectSchema } from "../../schema";

const app = new Hono()
    .get('/', sessionMiddleware, zValidator('query', z.object({ workspaceId: z.string() })),
        async (c) => {
            const user = c.get('user');
            const databases = c.get('databases');
            const storage = c.get('storage');

            const { workspaceId } = c.req.valid('query');

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member) {
                return c.json({ error: 'Unauthorized.' }, 401);
            }

            const projects = await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
                Query.equal('workspaceid', workspaceId),
                Query.orderDesc('$createdAt'),
            ]);

            const projectsWithImages: Project[] = await Promise.all(
                projects.documents.map(async (project) => {
                    let image: string | undefined = undefined;

                    if (project.imageurl) {
                        const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, project.imageurl);
                        image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
                    }

                    return {
                        ...project,
                        image,
                    };
                }),
            );

            return c.json({
                data: {
                    documents: projectsWithImages,
                    total: projects.total,
                },
            });
        },
    )
    .post('/', sessionMiddleware, zValidator('form', createProjectSchema), async (c) => {
        const databases = c.get('databases');
        const storage = c.get('storage');
        const user = c.get('user');

        const { name, image, workspaceId } = c.req.valid('form');

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
        });

        if (!member) {
            return c.json({ error: 'Unauthorized.' }, 401);
        }

        let uploadedImageId: string | undefined = undefined;

        if (image instanceof File) {
            const fileExt = image.name.split('.').at(-1) ?? 'png';
            const fileName = `${ID.unique()}.${fileExt}`;

            const renamedImage = new File([image], fileName, {
                type: image.type,
            });
            const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), renamedImage);

            uploadedImageId = file.$id;
        } else {
            uploadedImageId = image;
        }

        const project = await databases.createDocument(DATABASE_ID, PROJECTS_ID, ID.unique(), {
            name,
            imageurl: uploadedImageId,
            workspaceid: workspaceId,
        });

        return c.json({ data: project });
    })
    .get('/:projectId', sessionMiddleware, async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');
        const storage = c.get('storage');

        const { projectId } = c.req.param();

        const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

        const member = await getMember({
            databases,
            workspaceId: project.workspaceid,
            userId: user.$id,
        });

        if (!member) {
            return c.json(
                {
                    error: 'Unauthorized.',
                },
                401,
            );
        }

        let image: string | undefined = undefined;

        if (project.imageurl) {
            const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, project.imageurl);
            image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
        }

        return c.json({
            data: {
                ...project,
                image,
            },
        });
    })
    .patch('/:projectId', sessionMiddleware, zValidator('form', updateProjectSchema), async (C) => {
        const databases = C.get('databases');
        const storage = C.get('storage');
        const user = C.get('user');

        const { projectId } = C.req.param();
        const { name, image } = C.req.valid('form');

        const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

        const member = await getMember({
            databases,
            workspaceId: existingProject.workspaceid,
            userId: user.$id,
        });

        if (!member) {
            return C.json(
                {
                    error: 'Unauthorized.',
                },
                401,
            );
        }

        let uploadedImageId: string | undefined = undefined;

        if (image instanceof File) {
            const fileExt = image.name.split('.').at(-1) ?? 'png';
            const fileName = `${ID.unique()}.${fileExt}`;

            const renamedImage = new File([image], fileName, {
                type: image.type,
            });

            const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), renamedImage);

            // delete old project image
            if (existingProject.imageurl) await storage.deleteFile(IMAGES_BUCKET_ID, existingProject.imageurl);

            uploadedImageId = file.$id;
        }

        const project = await databases.updateDocument(DATABASE_ID, PROJECTS_ID, projectId, {
            name,
            image: uploadedImageId,
        });

        return C.json({ data: project });
    })



export default app;