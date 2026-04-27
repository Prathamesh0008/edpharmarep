"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Hero from "./components/Hero";
import HomeProducts from "./components/HomeProducts";
import FeaturedProducts from "./components/FeaturedProducts";
import Testimonials from "./components/Testimonials";

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("ED Ajanta Pharma");
  const { t } = useLanguage();

  const heroTitle =
    t?.homePage?.hero?.title ||
    "Trusted Pharmaceutical Manufacturing & Global Distribution";
  const heroSubtitle =
    t?.homePage?.hero?.subtitle ||
    "ED Pharma delivers high-quality, GMP-compliant pharmaceutical products across regulated international markets.";

  return (
    <>
      <Hero heroTitle={heroTitle} heroSubtitle={heroSubtitle} />
      <HomeProducts activeBrand={activeBrand} setActiveBrand={setActiveBrand} />
      <FeaturedProducts />
      <Testimonials />
    </>
  );
}
