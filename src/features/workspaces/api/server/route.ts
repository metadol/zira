import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createWorkspaceSchema, updateWorkspaceSchema } from '../../schemas';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { ID, type Models, Query } from 'node-appwrite';
import { generateInviteCode } from '@/lib/utils';
import { getMember } from '@/features/members/utils';
import { Workspace } from '@/types';
import z from 'zod';


enum MemberRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

const app = new Hono()
    .post('/', sessionMiddleware, zValidator('form', createWorkspaceSchema), async (c) => {
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
                // Generate a random invite code for the workspace 
                // which can be used to invite other users
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
    })

    .get("/:workspaceId", sessionMiddleware, async (c) => {
        const user = c.get("user");
        const storage = c.get('storage');
        const databases = c.get("databases");

        const { workspaceId } = c.req.param();

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
        });

        if (!member) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId
        );

        // Attach base64 image if available
        let image: string | undefined = undefined;

        if (workspace.image) {
            try {
                const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, workspace.image);
                image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
            } catch (error) {
                console.error(`Error fetching image for workspace ${workspace.$id}:`, error);
            }
        }

        // return c.json({ data: workspace });

        // Return workspace with embedded image
        return c.json({
            data: {
                ...workspace,
                image,
            },
        });
    })

    .patch('/:workspaceId', sessionMiddleware, zValidator('form', updateWorkspaceSchema), async (c) => {
        const databases = c.get('databases');
        const storage = c.get('storage');
        const user = c.get('user');

        const { workspaceId } = c.req.param();
        const { name, image } = c.req.valid('form');

        const existingWorkspace = await databases.getDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
        });

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json(
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
            if (existingWorkspace.image) await storage.deleteFile(IMAGES_BUCKET_ID, existingWorkspace.image);

            uploadedImageId = file.$id;
        }

        const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
            name,
            image: uploadedImageId,
        });

        return c.json({ data: workspace });
    })

    .delete('/:workspaceId', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const user = c.get('user');

        const { workspaceId } = c.req.param();

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
        });

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json(
                {
                    error: 'Unauthorized.',
                },
                401,
            );
        }

        //TODO : Delete related projects, tasks, members, and files when a workspace is deleted.

        await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

        return c.json({ data: { $id: workspaceId } });
    })

    .post('/:workspaceId/reset-invite-code', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const user = c.get('user');

        const { workspaceId } = c.req.param();

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
        });

        //ONLY ADMIN CAN RESET INVITE CODE
        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json(
                {
                    error: 'Unauthorized.',
                },
                401,
            );
        }


        const workspace = await databases.updateDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId,
            {
                invitecode: generateInviteCode(6),
            }
        );

        return c.json({ data: workspace });
    })

    .post('/:workspaceId/join', sessionMiddleware, zValidator('json', z.object({ code: z.string() })),
        async (c) => {
            const { workspaceId } = c.req.param();
            const { code } = c.req.valid('json');

            const databases = c.get('databases');
            const user = c.get('user');

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (member) {
                return c.json({ error: 'Already a member.' }, 400);
            }

            const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

            if (workspace.inviteCode !== code) {
                return c.json({ error: 'Invalid invite code.' }, 400);
            }

            await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
                workspaceId,
                userid: user.$id,
                role: MemberRole.MEMBER,
            });

            return c.json({ data: workspace });
        },
    )
    
    .get('/:workspaceId/info', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const { workspaceId } = c.req.param();

        const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

        return c.json({
            data: {
                $id: workspace.$id,
                name: workspace.name,
            },
        });
    })



export default app;