import 'server-only';

import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { AUTH_COOKIE } from './constants';

import {
    Account,
    Databases,
    Models,
    Storage,
    Users,
    Client,
    type Account as AccountType,
    type Databases as DatabasesType,
    type Storage as StorageType,
    type Users as UsersType,
} from 'node-appwrite';

//to ensure type-safety
type AdditionalContext = {
    Variables: {
        account: AccountType;
        databases: DatabasesType;
        storage: StorageType;
        users: UsersType;
        user: Models.User<Models.Preferences>;
    };
};

//THIS IS FOR API ROUTE PROTECTION 

// Middleware in Node.js refers to a concept where functions can be used 
// to process incoming requests before they reach their final destination.
export const sessionMiddleware = createMiddleware<AdditionalContext>(async (c, next) => {
    const client = new Client().setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = getCookie(c, AUTH_COOKIE);

    if (!session) {
        return c.json({ error: 'Unauthorized.' }, 401);
    }

    client.setSession(session);

    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    const user = await account.get();

    c.set('account', account);
    c.set('databases', databases);
    c.set('storage', storage);
    c.set('user', user);

    await next();
});


// 👦: “What is middleware?”

// 👩‍🏫: Imagine you want to go inside an amusement park 🎢.

// At the gate, there’s a guard 👮.

// The guard checks your ticket 🎟️.

// If you have a ticket ✅, the guard lets you inside to enjoy the rides.

// If you don’t ❌, the guard stops you at the gate.

// That guard at the gate = middleware.

// In your app:

// You (client/browser) = the person who wants to enter.

// Middleware = the guard at the entrance.

// Routes/handlers = the rides inside the park.

// 💡 So middleware’s job is very simple:

// Check something before you reach the ride (your route).

// Decide if you can continue or must stop.

// Sometimes, also give you extra things (like a wristband or map 🗺️ = extra data in request).

// 👉 Without middleware:
// Every ride (each route) would have its own guard.
// You’d get checked again and again 😩.

// 👉 With middleware:
// One guard at the entrance checks you once ✅.
// Then you can enjoy the rides freely. 🎉


//USAGE EXAMPLE

// // Apply middleware only to this route
// app.get('/profile', sessionMiddleware, (c) => {
//   const user = c.get('user')
//   return c.json({ message: `Welcome ${user.name}` })
// })

// // Another route without middleware
// app.get('/public', (c) => {
//   return c.json({ message: 'Anyone can see this 🚀' })
// })