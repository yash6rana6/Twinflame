// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );

  // Delete token cookie securely
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // prevent CSRF
    path: "/", // available site-wide
    expires: new Date(0), // immediate delete
  });

  return response;
}