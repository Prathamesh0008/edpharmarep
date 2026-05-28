"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Hero from "./components/Hero";
import HomeProducts from "./components/HomeProducts";
import FeaturedProducts from "./components/FeaturedProducts";
import Testimonials from "./components/Testimonials";

export default function HomePageClient() {
  const [activeBrand, setActiveBrand] = useState("ED Ajanta Pharma");
  const { t } = useLanguage();

  const heroTitle =
    t?.homePage?.hero?.title ||
    "Trusted Pharmaceutical Manufacturing & Global Distribution";
  const heroSubtitle =
    t?.homePage?.hero?.subtitle ||
    "ED Pharma delivers high-quality, GMP-compliant pharmaceutical products across regulated international markets.";
  const hero = t?.homePage?.hero || {};

  return (
    <>
      <Hero heroTitle={heroTitle} heroSubtitle={heroSubtitle} hero={hero} />
      <HomeProducts activeBrand={activeBrand} setActiveBrand={setActiveBrand} />
      <FeaturedProducts />
      <Testimonials />
    </>
  );
}
