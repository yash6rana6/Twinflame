"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/profile");
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-pink-50 px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back ❤️
        </h1>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-pink-600">
            Register
          </Link>
        </p>

      </div>
    </main>
  );
}