import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/constants";
import { createAdminClient } from "@/lib/appwrite";
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
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
