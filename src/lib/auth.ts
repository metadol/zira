import { setCookie } from 'hono/cookie'
import { AUTH_COOKIE } from '@/lib/constants'
import { createSessionClient } from '@/lib/appwrite';


export const setAuthCookie = (c: any, secret: string) => {
    setCookie(c, AUTH_COOKIE, secret, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    })
}

/**
 * Returns the current user if the session is valid, otherwise returns null.
 * @returns {Promise<User | null>} The current user if the session is valid, otherwise null.
 */

// this getCurrentUser allows us to check if the user is logged in
// on the server side so that 
// we can avoid suing usecurrent hook in the compoennt  
// which would require the component to be a client component
// OTHERWISE, we would have to make the component a client component and redirect using useeffect
export const getCurrentUser = async () => {
    try {
        const { account } = await createSessionClient();
        return await account.get();
    } catch {
        return null;
    }
};

// 1.Login/Register → User sends request → Hono → calls Appwrite → Appwrite creates session → Hono sets session secret in cookie.

// 2.Requests → Browser auto-sends cookie → Hono middleware reads cookie → asks Appwrite if session is valid → if yes, allow; if not, reject.

// 3.Logout → Hono deletes cookie → also tells Appwrite to invalidate session.

// 👉 Appwrite = auth + sessions
// 👉 Hono = API layer + cookie manager
