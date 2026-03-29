"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function MobileMenu({
  user,
  loading,
  scrolled,
  onLogout,
  onClose,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden overflow-hidden bg-gradient-to-r from-[#FFF5F7]/95 to-[#FFE4E9]/90 backdrop-blur-xl border-t border-[#E91E63]/20"
    >
      <div className="mt-5 pb-8 space-y-5 px-6">
        {user && (
          <>
            <Link
              href="/#vault"
              className="block text-center text-sm uppercase tracking-[0.2em] font-bold text-[#4A2C2C]/80 hover:text-[#E91E63] transition-colors"
              onClick={onClose}
            >
              Products
            </Link>
            <Link
              href="/timeline"
              className="block text-center text-sm uppercase tracking-[0.2em] font-bold text-[#4A2C2C]/80 hover:text-[#E91E63] transition-colors"
              onClick={onClose}
            >
              Timeline
            </Link>
            <Link
              href="/quiz"
              className="block text-center text-sm uppercase tracking-[0.2em] font-bold text-[#4A2C2C]/80 hover:text-[#E91E63] transition-colors"
              onClick={onClose}
            >
              Quiz
            </Link>
            <Link
              href="/profile"
              className="block text-center text-sm uppercase tracking-[0.2em] font-bold text-[#4A2C2C]/80 hover:text-[#E91E63] transition-colors"
              onClick={onClose}
            >
              Profile
            </Link>
            <Link
              href="/watch"
              className="block text-center text-sm uppercase tracking-[0.2em] font-bold text-[#4A2C2C]/80 hover:text-[#E91E63] transition-colors"
              onClick={onClose}
            >
              Watch
            </Link>
            <div className="relative">
              <NotificationBell />
            </div>
          </>
        )}

        {!loading && (
          <>
            {user ? (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="block w-full text-center px-6 py-4 rounded-full bg-gradient-to-r from-[#FFD700] via-[#F4C430] to-[#DAA520] hover:from-[#FFEA70] hover:via-[#FFFACD] hover:to-[#FFE135] text-[#4A2C2C] text-sm font-bold uppercase tracking-[0.22em] shadow-md border border-[#FFD700]/30"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  href="/register"
                  className="block text-center px-6 py-4 rounded-full bg-gradient-to-r from-[#c2185b] via-[#d81b60] to-[#e91e63] text-white text-sm font-bold uppercase tracking-[0.22em] shadow-md"
                  onClick={onClose}
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="block text-center px-6 py-4 rounded-full bg-white border-2 border-[#E91E63] text-[#E91E63] text-sm font-bold uppercase tracking-[0.22em] shadow-md hover:bg-[#E91E63]/10"
                  onClick={onClose}
                >
                  Login
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
