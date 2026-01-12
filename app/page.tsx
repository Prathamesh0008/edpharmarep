// "use client";

// import Navbar from "../app/components/Navbar";
// import Footer from "../app/components/Footer";
// import Link from "next/link";
// import Image from "next/image";
// import { products } from "../app/data/products";
// import Testimonials from "../app/components/Testimonials";
// import Compliance from "../app/components/Compliance";
// import HomeProducts from "../app/components/HomeProducts";
// import { useState, useEffect } from "react";
// import ScrollProgressLine from "../app/components/ScrollProgressLine"; 
// import FeaturedProducts from "./components/FeaturedProducts";
// import { useLanguage } from "@/context/LanguageContext";

// // Define brands array here since it's used in the Home component
// const brands = [
//   {
//     key: "ED Ajanta Pharma",
//     logo: "/logo/ajanta.webp",
//   },
//   { key: "ED Sunrise Remedies", logo: "/logo/sunrise.png" },
//   { key: "ED Centurion Remedies", logo: "/logo/cen.png" },
// ];

// export default function Home() {
//   const [activeBrand, setActiveBrand] = useState("ED Ajanta Pharma");
//   const { t } = useLanguage();

//   // Get translations from context, fallback to English structure
//   const homeTranslations = t?.homePage || {
//     hero: {
//       title: "Trusted Pharmaceutical Manufacturing & Global Distribution",
//       subtitle: "ED Pharma delivers high-quality, GMP-compliant pharmaceutical products across regulated international markets.",
//       ctaViewProducts: "View Products"
//     },
//     featured: {
//       title: "Featured Products"
//     }
//   };

//   const hero = homeTranslations?.hero || {};
//   const featured = homeTranslations?.featured || {};

//   return (
//     <>
//       <Navbar />

//       {/* Add ScrollProgressLine here - positioned right after Navbar */}
//       <ScrollProgressLine />

//       {/* HERO */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
//         {/* MOBILE: Logos above hero content - MEDIUM SIZE */}
//         <div className="block md:hidden mb-8">
//           <div className="text-center mb-5">
//             <p className="text-sm font-semibold text-[#0A2A73] uppercase tracking-wider mb-2">
//               Our Brands
//             </p>
//             <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-[#0A2A73] to-transparent"></div>
//           </div>
          
//           {/* Horizontal logos for mobile - MEDIUM SIZE */}
//           <div className="flex justify-center gap-4 sm:gap-5">
//             {brands.map((brand) => {
//               const active = brand.key === activeBrand;
//               return (
//                 <button
//                   key={brand.key}
//                   onClick={() => setActiveBrand(brand.key)}
//                   className={`
//                     relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl
//                     bg-white border-2 shadow-lg hover:shadow-xl transition-all duration-300
//                     ${active 
//                       ? 'border-[#0A2A73] scale-105 shadow-xl' 
//                       : 'border-gray-200 hover:border-gray-300'
//                     }
//                   `}
//                 >
//                   <div className="relative w-full h-full p-4">
//                     <Image
//                       src={brand.logo}
//                       alt={brand.key}
//                       fill
//                       className="object-contain p-3 transition-transform duration-300 group-hover:scale-110"
//                       sizes="(max-width: 640px) 96px, 112px"
//                     />
                    
//                     {/* Active indicator - MEDIUM SIZE */}
//                     {active && (
//                       <div className="absolute top-2 right-2 w-5 h-5 bg-[#0A2A73] rounded-full flex items-center justify-center shadow-md">
//                         <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                         </svg>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Brand label - MEDIUM SIZE */}
//                   <div className="mt-2 text-center">
//                     <span className={`
//                       text-xs font-medium px-2 py-1 rounded-full
//                       ${active 
//                         ? 'text-white bg-[#0A2A73]' 
//                         : 'text-slate-700 bg-gray-100'
//                       }
//                     `}>
//                       {brand.key.replace("ED ", "").split(" ")[0]}
//                     </span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
          
//           {/* Active brand indicator for mobile - MEDIUM SIZE */}
//           <div className="mt-5 text-center">
//             <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
//               <span className="text-sm font-semibold text-[#0A2A73]">
//                 {activeBrand.replace("ED ", "")}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
          
//           {/* LEFT CONTENT - Takes 2/3 on desktop */}
//           <div className="md:col-span-2 relative group">
//             {/* Border gradient fade */}
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200/30 via-transparent to-transparent rounded-2xl blur opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10" />
            
//             {/* Subtle backdrop with soft edges */}
//             <div className="backdrop-blur-xs bg-white/50 p-6 md:p-8 rounded-2xl border border-blue-100/30 shadow-sm">
//               <div className="relative">
//                 <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2A73] leading-tight">
//                   {hero.title || "Trusted Pharmaceutical Manufacturing & Global Distribution"}
//                 </h1>

//                 <p className="mt-6 text-base md:text-lg text-slate-600 max-w-xl">
//                   {hero.subtitle || "ED Pharma delivers high-quality, GMP-compliant pharmaceutical products across regulated international markets."}
//                 </p>

//                 <Link
//                   href="/products"
//                   className="inline-block mt-8 px-6 py-3 rounded-xl bg-[#0A2A73] text-white font-medium shadow hover:shadow-md hover:bg-blue-800 transition-all duration-300"
//                 >
//                   {hero.ctaViewProducts || "View Products"}
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDE VERTICAL LOGOS - Takes 1/3 on desktop - MEDIUM SIZE */}
//           <div className="md:col-span-1">
//             {/* DESKTOP: Vertical logos on right side - MEDIUM SIZE */}
//             <div className="hidden md:block">
//               <div className="sticky top-24">
//                 <div className="mb-5 text-center">
//                   <p className="text-sm font-semibold text-[#0A2A73] uppercase tracking-wider mb-2">
//                     Our Brands
//                   </p>
//                   <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-[#0A2A73] to-transparent"></div>
//                 </div>
                
//                 {/* Vertical Logo Strip - MEDIUM SIZE */}
//                 <div className="flex flex-col items-center space-y-5">
//                   {brands.map((brand) => {
//                     const active = brand.key === activeBrand;
//                     return (
//                       <button
//                         key={brand.key}
//                         onClick={() => setActiveBrand(brand.key)}
//                         className={`
//                           relative group w-full max-w-[140px] aspect-square rounded-2xl
//                           bg-white border-2 shadow-xl hover:shadow-2xl transition-all duration-300
//                           ${active 
//                             ? 'border-[#0A2A73] scale-105 shadow-2xl' 
//                             : 'border-gray-200 hover:border-gray-300'
//                           }
//                         `}
//                       >
//                         <div className="relative w-full h-full p-5">
//                           <Image
//                             src={brand.logo}
//                             alt={brand.key}
//                             fill
//                             className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
//                             sizes="(min-width: 768px) 140px"
//                           />
                          
//                           {/* Active indicator - MEDIUM SIZE */}
//                           {active && (
//                             <div className="absolute top-3 right-3 w-6 h-6 bg-[#0A2A73] rounded-full flex items-center justify-center shadow-lg">
//                               <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                               </svg>
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* Brand label on hover - MEDIUM SIZE */}
//                         {/* <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                           <span className="text-sm font-medium text-slate-800 whitespace-nowrap bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-200">
//                             {brand.key.replace("ED ", "")}
//                           </span>
//                         </div> */}
//                       </button>
//                     );
//                   })}
//                 </div>
                
//                 {/* Counter showing active brand - MEDIUM SIZE */}
//                 <div className="mt-6 text-center">
//                   <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
//                     <span className="text-base font-semibold text-[#0A2A73]">
//                       {activeBrand.replace("ED ", "")}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <HomeProducts
//         activeBrand={activeBrand}
//         setActiveBrand={setActiveBrand}
//       />
      
//       <FeaturedProducts />
     
//       <Compliance />
      
//       <Testimonials />
//     </>
//   );
// }

// function HeroProductImage() {
//   // ✅ remove empty / null / undefined images
//   const images = products
//     .map((p) => p.image)
//     .filter(Boolean);

//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     if (images.length === 0) return;

//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % images.length);
//     }, 3000);

//     return () => clearInterval(timer);
//   }, [images.length]);

//   // ✅ safety guard
//   if (images.length === 0) return null;

//   return (
//     <div className="relative h-[320px] md:h-[390px] w-full">
//       {images.map((src, i) => (
//         <Image
//           key={i}
//           src={src || "/placeholder.png"}
//           alt="ED Pharma Product"
//           fill
//           priority={i === 0}
//           className={`
//             object-contain transition-all duration-700
//             ${i === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}
//           `}
//         />
//       ))}
//     </div>
//   );
// }

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

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className=" gap-8 md:gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="relative group ">
            {/* Border gradient fade */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200/30 via-transparent to-transparent rounded-2xl blur opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10" />
            
            {/* Subtle backdrop with soft edges */}
            <div className="backdrop-blur-xs bg-white/50 p-6 md:p-8 rounded-2xl border border-blue-100/30 shadow-sm">
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