import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

app.get('/test/:id', (c) => {
  return c.json({
    message: 'This is a test endpoint! ID: ' + c.req.param('id'),
  })
})

export const GET = handle(app)
export const POST = handle(app)