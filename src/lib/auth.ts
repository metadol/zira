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
