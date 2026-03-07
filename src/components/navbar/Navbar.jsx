"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Brand from "./Brand";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/context/AuthContext"; // ✅ FIXED

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoutClick = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`
        sticky top-0 z-50 px-6 transition-all duration-500 ease-in-out
        ${
          scrolled
            ? "py-1.5 bg-gradient-to-r from-[#FFF5F7]/95 via-[#FFE4E9]/90 to-[#FFF0F5]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(233,30,99,0.25)] border-b border-[#E91E63]/35"
            : "py-5 bg-[#FFF5F7]/80 backdrop-blur-md border-b border-[#E91E63]/15"
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Brand scrolled={scrolled} />

        <DesktopNav
          scrolled={scrolled}
          user={user}
          loading={loading}
          onLogout={handleLogoutClick}
        />

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`
            md:hidden relative rounded-xl bg-white border-2 border-[#E91E63]/20 flex items-center justify-center hover:border-[#E91E63] transition-all duration-400
            ${scrolled ? "w-8 h-8" : "w-10 h-10"}
          `}
        >
          <div
            className={`
              flex flex-col justify-between
              ${scrolled ? "w-4.5 h-3.5" : "w-5 h-4"}
            `}
          >
            <motion.span
              animate={
                mobileMenuOpen
                  ? { rotate: 45, y: scrolled ? 5.5 : 7 }
                  : { rotate: 0, y: 0 }
              }
              className="w-full h-0.5 bg-[#4A2C2C] rounded-full transition-all duration-300"
            />
            <motion.span
              animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-full h-0.5 bg-[#4A2C2C] rounded-full transition-all duration-300"
            />
            <motion.span
              animate={
                mobileMenuOpen
                  ? { rotate: -45, y: scrolled ? -5.5 : -7 }
                  : { rotate: 0, y: 0 }
              }
              className="w-full h-0.5 bg-[#4A2C2C] rounded-full transition-all duration-300"
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            user={user}
            loading={loading}
            scrolled={scrolled}
            onLogout={handleLogoutClick}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
