import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);


// 1. What is RPC?

// RPC stands for Remote Procedure Call.
// It’s a way for one program (the client) to call a function that actually runs on another machine or process (the server), as if it were a local function.

// You write code like getUser(123)

// Under the hood, RPC serializes the request ({ method: "getUser", params: [123] }), sends it over HTTP (or another protocol), executes the function on the server, and returns the result.

// So RPC makes client-server communication feel like function calls instead of constructing raw HTTP requests and parsing responses.

// 2. What does RPC in Hono.js do?

// Hono.js (the lightweight web framework for Cloudflare Workers, Bun, Node, etc.) has an RPC helper that allows you to define your backend endpoints and then automatically generate a type-safe client to call them.

// Basically:

// On the server side, you define “procedures” (functions) using Hono routes.

// On the client side, Hono generates a client that lets you call those functions directly, with full TypeScript type inference.

// You don’t have to manually write fetch('/api/users/123') and parse JSON — Hono’s RPC wraps it into function calls.



//EXAMPLES 

// 🚫 Normal way (without RPC)
// Server (Hono API route)
// import { Hono } from 'hono'

// const app = new Hono()

// app.get('/hello/:name', (c) => {
//   return c.json({ message: `Hello, ${c.req.param('name')}!` })
// })

// export default app

// Client (manual fetch)
// const res = await fetch('http://localhost:3000/hello/Kevin')
// const data = await res.json()

// console.log(data.message) // "Hello, Kevin!"


// 👉 Problems:

// You hardcode URLs.

// No type safety → if the server changes the route, the client breaks silently.

// You must always write fetch + res.json() boilerplate.

// ✅ Using Hono RPC

// Server (same as before, but export type)
// import { Hono } from 'hono'

// const app = new Hono()

// app.get('/hello/:name', (c) => {
//   return c.json({ message: `Hello, ${c.req.param('name')}!` })
// })

// export type AppType = typeof app   // 👈 important
// export default app

// Client (RPC style)
// import { hc } from 'hono/client'
// import type { AppType } from './server'

// // Create RPC client
// const client = hc<AppType>('http://localhost:3000')

// // Call it like a function
// const res = await client.hello[':name'].$get({ param: { name: 'Kevin' } })
// const data = await res.json()

// console.log(data.message) // "Hello, Kevin!"


// 👉 Benefits:

// Autocomplete for hello[':name'].

// Type safety (if you change params on server, client errors at compile-time).

// No need to manually build URLs or worry about typos.

// ⚡️ In short:

// Normal way → manual fetch, strings everywhere, more bugs.

// RPC way → feels like calling a local function, type-safe, less boilerplate.






//HONO JS FLOW
// So when you call useLogin.mutate({ json: { email, password } }) in your frontend:

// 1.The hook (useLogin.ts) calls the RPC client.

// 2.RPC client (rpc.ts) sends a request to /api/auth/login.

// 3.Next.js routes that to your main API entry (route.ts).

// 4.route.ts forwards it to the auth subroutes (auth/server/route.ts).

// 5.Zod validates, and you return a JSON response.