import { registerService } from "@/services/auth.service";
import { connectDb } from "@/lib/db";

export const registerController = async (req) => {
  try {
    const body = await req.json();

    await connectDb();

    const user = await registerService(body);

    return {
      status: 201,
      body: {
        message: "User registered successfully",
        user,
      },
    };

  } catch (error) {
    // 🔥 YAHI SABSE IMPORTANT PART HAI
    if (error.message === "USER_EXISTS") {
      return {
        status: 409,
        body: { error: "User already exists" },
      };
    }

    if (error.message === "ALL_FIELDS_REQUIRED") {
      return {
        status: 400,
        body: { error: "All fields are required" },
      };
    }

    console.error("Register error:", error);

    return {
      status: 500,
      body: { error: "Internal server error" },
    };
  }
};
