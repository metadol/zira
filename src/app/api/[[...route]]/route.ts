import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import auth from '@/features/auth/api/server/route'
import tasks from '@/features/tasks/api/server/route'
import members from '@/features/members/api/server/route'
import projects from '@/features/projects/api/server/route'
import workspaces from '@/features/workspaces/api/server/route'



const app = new Hono().basePath('/api')

const routes = app
    .route('/auth', auth)
    .route('/tasks', tasks)
    .route('/members', members)
    .route('/projects', projects)
    .route('/workspaces', workspaces)


export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
