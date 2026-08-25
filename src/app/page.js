"use client";

import Home from "@/components/Home";
import Footer from "@/components/Footer";
import { useTelegram } from "@/hooks/useTelegram";

const HomePage = () => {
  const { isTelegram, ready } = useTelegram();

  return (
    <>
      <Home />
      {ready && !isTelegram && <Footer />}
    </>
  );
};

export default HomePage;