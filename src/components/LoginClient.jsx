"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Heart, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
        // Bhai yahan hum check kar sakte hain agar error 'Please verify your email' wala hai
        setError(res.error || "Invalid email or password");
      } else {
        const redirectTo = searchParams.get("redirect") || "/profile";
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-[#E91E63] text-4xl"
        >
          ❤️
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4E9] to-[#FFF0F5] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#E91E63]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FF80AB]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_30px_80px_rgba(233,30,99,0.2)] border border-[#FADADD]/60 p-10 md:p-12 z-10"
      >
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-20 h-20 bg-gradient-to-br from-[#E91E63] to-[#FF80AB] rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200"
          >
            <Heart className="text-white w-10 h-10 fill-current" />
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A2C2C] mb-3 text-center">
          Welcome Back
        </h1>
        <p className="text-center text-[#8B5E66] mb-10 text-lg">
          Unlock your digital love story 💕
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-center text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8B5E66]/50 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#FADADD] bg-white/50 backdrop-blur-sm focus:outline-none focus:border-[#E91E63] focus:ring-4 focus:ring-[#E91E63]/10 transition-all text-[#4A2C2C] placeholder-[#8B5E66]/60"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8B5E66]/50 w-5 h-5" />
            <input
              type="password"
              name="password"
              placeholder="Your password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-[#FADADD] bg-white/50 backdrop-blur-sm focus:outline-none focus:border-[#E91E63] focus:ring-4 focus:ring-[#E91E63]/10 transition-all text-[#4A2C2C] placeholder-[#8B5E66]/60"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-white text-sm bg-gradient-to-r from-[#c2185b] via-[#d81b60] to-[#e91e63] shadow-[0_10px_40px_rgba(194,24,91,0.3)] hover:shadow-[0_20px_60px_rgba(194,24,91,0.5)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Login to Vault <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 flex flex-col gap-3 text-center">
          <p className="text-[#8B5E66] text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#E91E63] font-semibold hover:underline">
              Register here
            </Link>
          </p>
          <Link href="/forgot-password" size={14} className="text-[#8B5E66]/60 text-xs hover:text-[#E91E63] transition-colors">
            Forgot Password?
          </Link>
        </div>

        {/* Floating Decoration */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute -bottom-10 right-10 text-4xl opacity-20 grayscale pointer-events-none"
        >
          🔑
        </motion.div>
      </motion.div>
    </main>
  );
}