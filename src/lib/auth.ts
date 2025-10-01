import { setCookie } from 'hono/cookie'
import { AUTH_COOKIE } from '@/lib/constants'

export const setAuthCookie = (c: any, secret: string) => {
    setCookie(c, AUTH_COOKIE, secret, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    })
}

// 1.Login/Register → User sends request → Hono → calls Appwrite → Appwrite creates session → Hono sets session secret in cookie.

// 2.Requests → Browser auto-sends cookie → Hono middleware reads cookie → asks Appwrite if session is valid → if yes, allow; if not, reject.

// 3.Logout → Hono deletes cookie → also tells Appwrite to invalidate session.

// 👉 Appwrite = auth + sessions
// 👉 Hono = API layer + cookie manager
