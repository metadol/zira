import { success, z } from 'zod'
import { ID } from 'node-appwrite';
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { deleteCookie, setCookie } from 'hono/cookie';
import { loginSchema, registerSchema } from '../../schemas'
import { createAdminClient } from '@/lib/appwrite'
import { AUTH_COOKIE } from '@/lib/constants';
import { setAuthCookie } from '@/lib/auth';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()
  .get('/current', sessionMiddleware, async (c) => {
    const user = c.get('user')
    return c.json({ data: user })
  })
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const { email, password } = c.req.valid('json')

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    setAuthCookie(c, session.secret)

    return c.json({ success: true })
  })
  .post('/register', zValidator('json', registerSchema), async (c) => {
    const { name, email, password } = c.req.valid('json')

    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);
    setAuthCookie(c, session.secret)

    return c.json({ success: true })
  })
  .post('/logout', sessionMiddleware, async (c) => {

    const account = c.get('account');
    await account.deleteSession('current');

    deleteCookie(c, AUTH_COOKIE)
    return c.json({ success: true })
  })

export default app
