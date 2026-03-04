import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Project, Task, TaskStatus } from "@/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import z from "zod";
import { createProjectSchema, updateProjectSchema } from "../../schema";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

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
                        try {
                            const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, project.imageurl);
                            image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
                        } catch (error) {
                            console.error(`Error fetching image for project ${project.$id}:`, error);
                        }
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
            try {
                const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, project.imageurl);
                image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
            } catch (error) {
                console.error(`Error fetching image for project ${project.$id}:`, error);
            }
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

        let uploadedImageId: string | null | undefined = undefined;

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
        } else if (image === '' || image === undefined) {
            // User wants to remove the image
            if (existingProject.imageurl) {
                await storage.deleteFile(IMAGES_BUCKET_ID, existingProject.imageurl);
            }
            uploadedImageId = null;
        }

        const updateData: Record<string, any> = { name };
        if (uploadedImageId !== undefined) {
            updateData.imageurl = uploadedImageId;
        }

        const project = await databases.updateDocument(DATABASE_ID, PROJECTS_ID, projectId, updateData);

        return C.json({ data: project });
    })
    .delete('/:projectId', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const storage = c.get('storage');
        const user = c.get('user');

        const { projectId } = c.req.param();

        const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

        const member = await getMember({
            databases,
            workspaceId: existingProject.workspaceid,
            userId: user.$id,
        });

        if (!member) {
            return c.json({ error: 'Unauthorized.' }, 401);
        }

        // const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [Query.equal('projectId', projectId)]);

        // // delete tasks
        // for (const task of tasks.documents) {
        //     await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);
        // }

        if (existingProject.image) await storage.deleteFile(IMAGES_BUCKET_ID, existingProject.image);

        await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

        return c.json({ data: { $id: existingProject.$id, workspaceId: existingProject.workspaceid } });
    })
    //  analytics API endpoint for a specific project.
    //  It returns task statistics for the current month and how they changed compared to last month
    .get('/:projectId/analytics', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const user = c.get('user');
        const { projectId } = c.req.param();

        const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

        const member = await getMember({
            databases,
            workspaceId: project.workspaceid,
            userId: user.$id,
        });

        if (!member) {
            return c.json({ error: 'Unauthorized.' }, 401);
        }

        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));

        const thisMonthTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
            Query.equal('projectid', projectId),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]);

        const lastMonthTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
            Query.equal('projectid', projectId),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]);

        const taskCount = thisMonthTasks.total;
        const taskDifference = taskCount - lastMonthTasks.total;

        const thisMonthAssignedTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
            Query.equal('projectid', projectId),
            Query.equal('assigneeid', member.$id),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]);

        const lastMonthAssignedTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
            Query.equal('projectid', projectId),
            Query.equal('assigneeid', member.$id),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]);

        const assignedTaskCount = thisMonthAssignedTasks.total;
        const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.total;

        const thisMonthIncompleteTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
            Query.equal('projectid', projectId),
            Query.notEqual('status', TaskStatus.DONE),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]);

        const lastMonthIncompleteTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
            Query.equal('projectid', projectId),
            Query.notEqual('status', TaskStatus.DONE),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]);

        const incompleteTaskCount = thisMonthIncompleteTasks.total;
        const incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks.total;

        const thisMonthCompletedTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
            Query.equal('projectid', projectId),
            Query.equal('status', TaskStatus.DONE),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]);

        const lastMonthCompletedTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
            Query.equal('projectid', projectId),
            Query.notEqual('status', TaskStatus.DONE),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]);

        const completedTaskCount = thisMonthCompletedTasks.total;
        const completedTaskDifference = completedTaskCount - lastMonthCompletedTasks.total;

        const thisMonthOverdueTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
            Query.equal('projectid', projectId),
            Query.notEqual('status', TaskStatus.DONE),
            Query.lessThan('duedate', now.toISOString()),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]);

        const lastMonthOverdueTasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
            Query.equal('projectid', projectId),
            Query.notEqual('status', TaskStatus.DONE),
            Query.lessThan('duedate', now.toISOString()),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]);

        const overdueTaskCount = thisMonthOverdueTasks.total;
        const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total;

        return c.json({
            data: {
                taskCount,
                taskDifference,

                assignedTaskCount,
                assignedTaskDifference,

                completedTaskCount,
                completedTaskDifference,

                incompleteTaskCount,
                incompleteTaskDifference,
                
                overdueTaskCount,
                overdueTaskDifference,
            },
        });
    });


export default app;