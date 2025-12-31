"use client";

import Navbar from "../app/components/Navbar";
import Footer from "../app/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { products } from "../app/data/products";
import Testimonials from "../app/components/Testimonials";
import Compliance from "../app/components/Compliance";
import HomeProducts from "../app/components/HomeProducts";
import { useState,useEffect } from "react";
  

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("ED Ajanta Pharma");


  return (
    <>
      <Navbar  />

      {/* HERO */}
      
<section className="max-w-7xl mx-auto px-6 pt-3  rounded-2xl ">
  <div className="grid md:grid-cols-2 gap-12 items-center ">

    {/* LEFT CONTENT */}
    <div className="backdrop-blur p-2">
      <h1 className="text-4xl md:text-5xl font-semibold text-[#0A2A73] leading-tight ">
        Trusted Pharmaceutical Manufacturing & Global Distribution
      </h1>

      <p className="mt-6 text-lg text-slate-600 max-w-xl ">
        ED Pharma delivers high-quality, GMP-compliant pharmaceutical
        products across regulated international markets.
      </p>

      <Link
        href="/products"
        className="inline-block mt-8 px-6 py-3 rounded-xl bg-[#0A2A73] text-white font-medium shadow hover:opacity-90 transition"
      >
        View Products
      </Link>
    </div>

    {/* RIGHT IMAGE ROTATOR */}
    <HeroProductImage />
  </div>
</section>

    <HomeProducts
        activeBrand={activeBrand}
        setActiveBrand={setActiveBrand}
      />
      {/* PRODUCT PREVIEW */}
      <section className=" py-20">
        <div className="max-w-7xl mx-auto px-6 ">
          <h2 className="text-3xl font-semibold text-[#0A2A73] mb-10 backdrop-blur-lg">
            Featured Products
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="relative h-48">
                  <Image
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name || "mc"}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg text-[#0A2A73]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {product.dosage} · {product.form}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Compliance />
<Testimonials />
      <Footer />
      
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
