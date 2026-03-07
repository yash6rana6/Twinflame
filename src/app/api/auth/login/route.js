// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const { email, password } = body;

    // 1. Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Find user + select password explicitly
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 4. Generate JWT
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { userId: user._id.toString() }, // userId string mein rakho
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Safe user data (never send password or sensitive fields)
    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      // agar role ya avatar hai toh add kar sakte ho
    };

    // 6. Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: safeUser,
    });

    // 7. Set secure HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,           // JS se access nahi ho sakta
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax",       // CSRF protection
      path: "/",                // site-wide available
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}