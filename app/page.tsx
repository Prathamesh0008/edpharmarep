

"use client";

import Navbar from "../app/components/Navbar";
import Footer from "../app/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { products } from "../app/data/products";
import Testimonials from "../app/components/Testimonials";
import Compliance from "../app/components/Compliance";

import HomeProducts from "../app/components/HomeProducts";
import { useState, useEffect } from "react";
import ScrollProgressLine from "../app/components/ScrollProgressLine"; 
import FeaturedProducts from "./components/FeaturedProducts"
import { useLanguage } from "@/context/LanguageContext"; // ADD THIS IMPORT

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("ED Ajanta Pharma");
  const { t } = useLanguage(); // GET TRANSLATIONS FROM CONTEXT

  // Get translations from context, fallback to English structure
  const homeTranslations = t?.homePage || {
    hero: {
      title: "Trusted Pharmaceutical Manufacturing & Global Distribution",
      subtitle: "ED Pharma delivers high-quality, GMP-compliant pharmaceutical products across regulated international markets.",
      ctaViewProducts: "View Products"
    },
    featured: {
      title: "Featured Products"
    }
  };

  const hero = homeTranslations?.hero || {};
  const featured = homeTranslations?.featured || {};

  return (
    <>
      <Navbar />

      {/* Add ScrollProgressLine here - positioned right after Navbar */}
      <ScrollProgressLine />

      {/* BACKGROUND SVG */}
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: "url('/bg/ED-banner (2).svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className=" gap-8 md:gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="relative group ">
            {/* Border gradient fade */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200/30 via-transparent to-transparent rounded-2xl blur opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10" />
            
            {/* Subtle backdrop with soft edges */}
            <div className="backdrop-blur-xs bg-white/50 p-6 md:p-8 rounded-2xl border border-blue-100/30 shadow-sm -mt-15">
              <div className="relative">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2A73] leading-tight">
                  {hero.title || "Trusted Pharmaceutical Manufacturing & Global Distribution"}
                </h1>

                <p className="mt-6 text-base md:text-lg text-slate-600 max-w-xl">
                  {hero.subtitle || "ED Pharma delivers high-quality, GMP-compliant pharmaceutical products across regulated international markets."}
                </p>

                <Link
                  href="/products"
                  className="inline-block mt-8 px-6 py-3 rounded-xl bg-[#0A2A73] text-white font-medium shadow hover:shadow-md hover:bg-blue-800 transition-all duration-300"
                >
                  {hero.ctaViewProducts || "View Products"}
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE with soft border glow */}
          {/* <div className="relative">
            <div className="" />
            <div className="">
              <HeroProductImage />
            </div>
          </div> */}
        </div>
      </section>

      <HomeProducts
        activeBrand={activeBrand}
        setActiveBrand={setActiveBrand}
      />
      
      <FeaturedProducts />
     
      <Compliance />
      
      <Testimonials />
    </>
  );
}

function HeroProductImage() {
  // ✅ remove empty / null / undefined images
  const images = products
    .map((p) => p.image)
    .filter(Boolean);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  // ✅ safety guard
  if (images.length === 0) return null;

  return (
    <div className="relative h-[320px] md:h-[390px] w-full">
      {images.map((src, i) => (
        <Image
          key={i}
          src={src || "/placeholder.png"}
          alt="ED Pharma Product"
          fill
          priority={i === 0}
          className={`
            object-contain transition-all duration-700
            ${i === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          `}
        />
      ))}
    </div>
  );
}