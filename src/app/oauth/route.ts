// src/app/oauth/route.ts

import { AUTH_COOKIE } from "@/lib/constants";
import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    return NextResponse.json(
      { error: "Missing userId or secret" },
      { status: 400 }
    );
  }

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  console.log("OAuth session created:", session);

  cookies().set(AUTH_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax", // Relaxed same-site policy for better compatibility with OAuth redirects
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
