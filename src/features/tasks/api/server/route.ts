
import { z } from 'zod';
import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';
import { ID, Models, Query } from 'node-appwrite';
import { Project, TaskStatus, Task } from '@/types';

import { createAdminClient } from '@/lib/appwrite';
import { getMember } from '@/features/members/utils';
import { createTaskSchema } from '@/features/tasks/schema';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config';




const app = new Hono()
    .get(
        '/',
        sessionMiddleware,
        zValidator(
            'query',
            z.object({
                workspaceId: z.string(),
                projectId: z.string().nullish(),
                assigneeId: z.string().nullish(),
                status: z.enum(TaskStatus).nullish(),
                search: z.string().nullish(),
                dueDate: z.string().nullish(),
            }),
        ),
        async (c) => {
            const { users } = await createAdminClient();
            const databases = c.get('databases');
            const storage = c.get('storage');
            const user = c.get('user');

            const { workspaceId, projectId, assigneeId, status, search, dueDate } = c.req.valid('query');

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member) {
                return c.json({ error: 'Unauthorized.' }, 401);
            }

            const query = [Query.equal('workspaceId', workspaceId), Query.orderDesc('$createdAt')];

            // Build the Query by Applying filters 
            if (projectId) query.push(Query.equal('projectId', projectId));

            if (status) query.push(Query.equal('status', status));

            if (assigneeId) query.push(Query.equal('assigneeId', assigneeId));

            if (dueDate) query.push(Query.equal('dueDate', dueDate));

            if (search) query.push(Query.search('name', search));

            const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, query);

            const projectIds = tasks.documents.map((task) => task.projectId);
            const assigneeIds = tasks.documents.map((task) => task.assigneeId);

            const projects = await databases.listDocuments<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectIds.length > 0 ? [Query.contains('$id', projectIds)] : [],
            );

            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : [],
            );

            const assignees = await Promise.all(
                members.documents.map(async (member) => {
                    const user = await users.get(member.userId);

                    return {
                        ...member,
                        name: user.name,
                        email: user.email,
                    };
                }),
            );

            const populatedTasks: (Models.Document & Task)[] = await Promise.all(
                tasks.documents.map(async (task) => {
                    const project = projects.documents.find((project) => project.$id === task.projectId);
                    const assignee = assignees.find((assignee) => assignee.$id === task.assigneeId);

                    let imageUrl: string | undefined = undefined;

                    if (project?.imageId) {
                        const arrayBuffer = await storage.getFileView(IMAGES_BUCKET_ID, project.imageId);
                        imageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
                    }

                    return {
                        ...task,
                        project: {
                            ...project,
                            imageUrl,
                        },
                        assignee,
                    };
                }),
            );

            return c.json({
                data: {
                    ...tasks,
                    documents: populatedTasks,
                },
            });
        },
    )
    .get('/:taskId', sessionMiddleware, async (c) => {
        const { taskId } = c.req.param();
        const currentUser = c.get('user');
        const databases = c.get('databases');

        const { users } = await createAdminClient();

        const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

        const currentMember = await getMember({
            databases,
            workspaceId: task.workspaceId,
            userId: currentUser.$id,
        });

        if (!currentMember) {
            return c.json({ error: 'Unauthorized.' }, 401);
        }

        const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, task.projectId);

        const member = await databases.getDocument(DATABASE_ID, MEMBERS_ID, task.assigneeId);

        const user = await users.get(member.userId);

        const assignee = {
            ...member,
            name: user.name,
            email: user.email,
        };

        return c.json({
            data: {
                ...task,
                project,
                assignee,
            },
        });
    })
    .post('/', sessionMiddleware, zValidator('json', createTaskSchema), async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');

        const { name, status, workspaceId, projectId, dueDate, assigneeId } = c.req.valid('json');

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
        });

        if (!member) {
            return c.json({ error: 'Unauthorized.' }, 401);
        }

        const highestPositionTask = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('status', status),
            Query.equal('workspaceId', workspaceId),
            Query.orderAsc('position'),
            Query.limit(1),
        ]);

        const newPosition = highestPositionTask.documents.length > 0 ? highestPositionTask.documents[0].position + 1000 : 1000;

        const task = await databases.createDocument<Task>(DATABASE_ID, TASKS_ID, ID.unique(), {
            name,
            status,
            workspaceId,
            projectId,
            dueDate,
            assigneeId,
            position: newPosition,
        });

        return c.json({ data: task });
    })
    .patch('/:taskId', sessionMiddleware, zValidator('json', createTaskSchema.partial()), async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');

        const { name, status, description, projectId, dueDate, assigneeId } = c.req.valid('json');
        const { taskId } = c.req.param();

        const existingTask = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

        const member = await getMember({
            databases,
            workspaceId: existingTask.workspaceId,
            userId: user.$id,
        });

        if (!member) {
            return c.json({ error: 'Unauthorized.' }, 401);
        }

        const task = await databases.updateDocument(DATABASE_ID, TASKS_ID, taskId, {
            name,
            status,
            projectId,
            dueDate,
            assigneeId,
            description,
        });

        return c.json({ data: task });
    })
    .post(
        '/bulk-update',
        sessionMiddleware,
        zValidator(
            'json',
            z.object({
                tasks: z.array(
                    z.object({
                        $id: z.string(),
                        status: z.enum(TaskStatus),
                        position: z.number().int().positive().min(1000).max(1_00_000),
                    }),
                ),
            }),
        ),
        async (c) => {
            const databases = c.get('databases');
            const user = c.get('user');
            const { tasks } = c.req.valid('json');

            const tasksToUpdate = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, [
                Query.contains(
                    '$id',
                    tasks.map((task: { $id: any }) => task.$id),
                ),
            ]);

            const workspaceIds = new Set(tasksToUpdate.documents.map((task) => task.workspaceId));

            if (workspaceIds.size !== 1) {
                return c.json({ error: 'All tasks must belong to the same workspace.' }, 401);
            }

            const workspaceId = workspaceIds.values().next().value!;

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member) {
                return c.json({ error: 'Unauthorized.' }, 401);
            }

            const updatedTasks = await Promise.all(
                tasks.map(async (task: { $id: any; status: any; position: any }) => {
                    const { $id, status, position } = task;

                    return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, { status, position });
                }),
            );

            return c.json({ data: { updatedTasks, workspaceId } });
        },
    )
    .delete('/:taskId', sessionMiddleware, async (c) => {
        const user = c.get('user');
        const databases = c.get('databases');

        const { taskId } = c.req.param();

        const task = await databases.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

        const member = await getMember({
            databases,
            workspaceId: task.workspaceId,
            userId: user.$id,
        });

        if (!member) {
            return c.json({ error: 'Unauthorized.' }, 401);
        }

        await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

        return c.json({ data: task });
    });

export default app;


// GET /
// List all tasks in a workspace
// Supports filters: project, assignee, status, due date, search
// Populates project info and assignee details

// GET /:taskId
// Get a single task by ID
// Includes project and assignee data

// POST /
// Create a new task in a workspace
// Automatically assigns task position

// PATCH /:taskId
// Update an existing task
// Supports partial updates

// POST /bulk-update
// Update status and position of multiple tasks at once
// Used for drag-and-drop / reordering

// DELETE /:taskId
// Delete a task