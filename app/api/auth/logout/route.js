import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // 🔥 FORCE DELETE auth cookie (MATCH LOGIN COOKIE EXACTLY)
  response.cookies.set("auth", "", {
    httpOnly: true,
    secure: false,        // must match (localhost / IP)
    sameSite: "lax",      // must match
    path: "/",            // must match
    maxAge: 0,
  });

  return response;
}
