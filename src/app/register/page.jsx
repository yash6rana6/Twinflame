"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", { // ✅ FIX HERE
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-[#FFE4E9] to-[#FFF0F5] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decorative orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#E91E63]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FF80AB]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_30px_80px_rgba(233,30,99,0.2)] border border-[#FADADD]/60 p-10 md:p-12 z-10"
      >
        {/* Heart Logo */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-[#E91E63] to-[#FF80AB] rounded-2xl flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-4xl">❤️</span>
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A2C2C] mb-3 text-center">
          Create Your Love Vault
        </h1>
        <p className="text-center text-[#8B5E66] mb-10 text-lg">
          Let's start your digital love story 💕
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-[#FFE4E9]/80 border border-[#E91E63]/30 text-[#E91E63] rounded-xl text-center text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <input
              name="name"
              placeholder="Your name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-6 py-5 rounded-2xl border border-[#FADADD] bg-white/50 backdrop-blur-sm focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/30 transition-all text-[#4A2C2C] placeholder-[#8B5E66]"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-6 py-5 rounded-2xl border border-[#FADADD] bg-white/50 backdrop-blur-sm focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/30 transition-all text-[#4A2C2C] placeholder-[#8B5E66]"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-6 py-5 rounded-2xl border border-[#FADADD] bg-white/50 backdrop-blur-sm focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-[#E91E63]/30 transition-all text-[#4A2C2C] placeholder-[#8B5E66]"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className={`
              w-full py-5 rounded-2xl font-bold uppercase tracking-wider text-white text-sm
              bg-gradient-to-r from-[#c2185b] via-[#d81b60] to-[#e91e63]
              shadow-[0_10px_40px_rgba(194,24,91,0.4)] hover:shadow-[0_20px_60px_rgba(194,24,91,0.6)]
              transition-all duration-300 flex items-center justify-center gap-2
              disabled:opacity-70 disabled:cursor-not-allowed
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating your vault...
              </>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-[#8B5E66] text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[#E91E63] font-semibold hover:underline">
            Login here
          </Link>
        </p>

        {/* Decorative heart */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-6xl opacity-30 pointer-events-none"
        >
          💕
        </motion.div>
      </motion.div>
    </main>
  );
}