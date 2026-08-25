"use client";

import FloatingOrbs from "./landing/FloatingOrbs";
import HeroSection from "./landing/HeroSection";
import ProductsSection from "./landing/ProductsSection";
import TelegramProductsSection from "./landing/TelegramProductsSection";
import HowItWorksSection from "./landing/HowItWorksSection";
import StatsSection from "./landing/StatsSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import FinalCTASection from "./landing/FinalCTASection";
import { useTelegram } from "@/hooks/useTelegram";

export default function Home() {
  const { isTelegram, ready } = useTelegram();

  // Telegram ke ready hone tak kuch render mat karo (flicker avoid)
  if (!ready) return null;

  // ── Telegram Mini App: sirf cards, baaki kuch nahi ──
  if (isTelegram) {
    return (
      <main className="relative bg-[#FFF5F7] text-[#4A2C2C] overflow-x-hidden min-h-screen">
        <TelegramProductsSection />
      </main>
    );
  }

  // ── Normal website: full landing page ──
  return (
    <main className="relative bg-[#FFF5F7] text-[#4A2C2C] overflow-x-hidden">
      <FloatingOrbs />

      <HeroSection />
      <ProductsSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <FinalCTASection />
    </main>
  );
}