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
  const { isTelegram } = useTelegram();

  return (
    <main className="relative bg-[#FFF5F7] text-[#4A2C2C] overflow-x-hidden">
      <FloatingOrbs />

      <HeroSection />
      {isTelegram ? <TelegramProductsSection /> : <ProductsSection />}
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <FinalCTASection />
    </main>
  );
}