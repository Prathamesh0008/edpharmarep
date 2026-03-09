"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Link from "next/link";
import Image from "next/image";
import { products } from "../app/data/products";
import Testimonials from "./components/Testimonials";
import Compliance from "./components/Compliance";

import HomeProducts from "../app/components/HomeProducts";
import { useState, useEffect } from "react";
import ScrollProgressLine from "../app/components/ScrollProgressLine"; 
import FeaturedProducts from "./components/FeaturedProducts"
import { useLanguage } from "@/context/LanguageContext";

// Define a type for translation objects
type TranslationObject = {
  [key: string]: string | TranslationObject;
};

type TranslationValue = string | TranslationObject | undefined | null;

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("ED Ajanta Pharma");
  const { t, language } = useLanguage();

  // Helper function to safely get string from translation object with proper typing
  const getTrans = (transObj: TranslationValue, fallback: string = ''): string => {
    if (!transObj) return fallback;
    if (typeof transObj === 'string') return transObj;
    if (typeof transObj === 'object') {
      // Try current language, then English, then any first value, then fallback
      const obj = transObj as TranslationObject;
      
      // If the object has the current language as a key and it's a string
      if (obj[language] && typeof obj[language] === 'string') {
        return obj[language] as string;
      }
      
      // If the object has 'en' as a key and it's a string
      if (obj.en && typeof obj.en === 'string') {
        return obj.en as string;
      }
      
      // Try to find any string value
      const values = Object.values(obj);
      for (const value of values) {
        if (typeof value === 'string') {
          return value;
        }
      }
    }
    return fallback;
  };

  const heroTitle = t?.homePage?.hero?.title || "Trusted Pharmaceutical Manufacturing & Global Distribution";
  const heroSubtitle = t?.homePage?.hero?.subtitle || "ED Pharma delivers high-quality, GMP-compliant pharmaceutical products across regulated international markets.";
  const heroCta = t?.homePage?.hero?.ctaViewProducts || "View Products";
  const featuredTitle = t?.homePage?.featured?.title || "Featured Products";
  
  return (
    <>
      <Navbar />

      {/* Add ScrollProgressLine here - positioned right after Navbar */}
      <ScrollProgressLine />

      {/* FULL-WIDTH BANNER WITH IMAGE AND HERO CONTENT */}
      
<div className="relative w-full h-[240px] sm:h-[340px] md:h-[480px] lg:h-[600px] xl:h-[720px] overflow-hidden -mt-14">

  {/* Background Image */}
 <div className="absolute inset-0 w-full h-full">
  <Image
    src="/bg/ED-banner (2).svg"
    alt="Pharmaceutical banner"
    fill
    priority
    sizes="100vw"
    className="object-contain object-center"
  />

  {/* Overlay */}
  <div className="absolute inset-0" />
</div>

  {/* Hero Content */}
  <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">

  <div className="relative group 
w-[70%] sm:w-[60%] md:w-[55%] lg:w-[50%] 
max-w-[260px] sm:max-w-md md:max-w-xl lg:max-w-2xl
ml-2 sm:ml-4 md:ml-0">

    {/* Gradient Glow */}
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/30 via-transparent to-transparent rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-300 -z-10" />

    {/* Content Card */}
    <div className="backdrop-blur-sm bg-white/40 p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl border border-blue-100/30 shadow-sm">

      <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#0A2A73] leading-tight">
        {heroTitle}
      </h1>

      <p className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 max-w-lg">
        {heroSubtitle}
      </p>

      <Link
        href="/products"
        className="inline-block mt-3 sm:mt-4 md:mt-5 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg bg-[#0A2A73] text-white font-medium shadow hover:shadow-md hover:bg-blue-800 transition-all duration-300 text-xs sm:text-sm md:text-base"
      >
        {heroCta}
      </Link>

    </div>
  </div>
</div>
</div>



      

      {/* Remove the old HERO section - it's now in the banner above */}

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
  // remove empty / null / undefined images
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

  // safety guard
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


// "use client";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Link from "next/link";
// import Image from "next/image";
// import { products } from "../app/data/products";
// import Testimonials from "./components/Testimonials";
// import Compliance from "./components/Compliance";

// import HomeProducts from "../app/components/HomeProducts";
// import { useState, useEffect } from "react";
// import ScrollProgressLine from "../app/components/ScrollProgressLine"; 
// import FeaturedProducts from "./components/FeaturedProducts"
// import { useLanguage } from "@/context/LanguageContext";

// // Define a type for translation objects
// type TranslationObject = {
//   [key: string]: string | TranslationObject;
// };

// type TranslationValue = string | TranslationObject | undefined | null;

// export default function Home() {
//   const [activeBrand, setActiveBrand] = useState("ED Ajanta Pharma");
//   const { t, language } = useLanguage();

//   // Helper function to safely get string from translation object with proper typing
//   const getTrans = (transObj: TranslationValue, fallback: string = ''): string => {
//     if (!transObj) return fallback;
//     if (typeof transObj === 'string') return transObj;
//     if (typeof transObj === 'object') {
//       // Try current language, then English, then any first value, then fallback
//       const obj = transObj as TranslationObject;
      
//       // If the object has the current language as a key and it's a string
//       if (obj[language] && typeof obj[language] === 'string') {
//         return obj[language] as string;
//       }
      
//       // If the object has 'en' as a key and it's a string
//       if (obj.en && typeof obj.en === 'string') {
//         return obj.en as string;
//       }
      
//       // Try to find any string value
//       const values = Object.values(obj);
//       for (const value of values) {
//         if (typeof value === 'string') {
//           return value;
//         }
//       }
//     }
//     return fallback;
//   };

//   // Safely navigate through translation objects
// //   const getNestedTranslation = (path: string[], fallback: string): string => {
// //   try {
// //     let value: any = t;

// //     for (const key of path) {
// //       value = value?.[key];
// //     }

// //     if (!value) return fallback;

// //     if (typeof value === "string") return value;

// //     if (typeof value === "object") {
// //       return value?.[language] || value?.en || fallback;
// //     }

// //     return fallback;
// //   } catch {
// //     return fallback;
// //   }
// // };

//   // Get translations with fallbacks
//   // const heroTitle = getNestedTranslation(
//   //   ['homePage', 'hero', 'title'],
//   //   "Trusted Pharmaceutical Manufacturing & Global Distribution"
//   // );
  
//   // const heroSubtitle = getNestedTranslation(
//   //   ['homePage', 'hero', 'subtitle'],
//   //   "ED Pharma delivers high-quality, GMP-compliant pharmaceutical products across regulated international markets."
//   // );
  
//   // const heroCta = getNestedTranslation(
//   //   ['homePage', 'hero', 'ctaViewProducts'],
//   //   "View Products"
//   // );
  
//   // const featuredTitle = getNestedTranslation(
//   //   ['homePage', 'featured', 'title'],
//   //   "Featured Products"
//   // );

// const heroTitle = t?.homePage?.hero?.title || "";
// const heroSubtitle = t?.homePage?.hero?.subtitle || "";
// const heroCta = t?.homePage?.hero?.ctaViewProducts || "";
// const featuredTitle = t?.homePage?.featured?.title || "";
//   return (
//     <>
//       <Navbar />

//       {/* Add ScrollProgressLine here - positioned right after Navbar */}
//       <ScrollProgressLine />

//       {/* BACKGROUND SVG */}
//         <div
//           className="fixed inset-0 -z-10"
//           style={{
//             backgroundImage: "url('/bg/ED-banner (2).svg')",
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//             backgroundSize: "cover",
//           }}
//         />

//       {/* HERO */}
//       <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14 ">
//         <div className=" gap-8 md:gap-12 items-center -mb-22">
          
//           {/* LEFT CONTENT */}
//           <div className="relative group ">
//             {/* Border gradient fade */}
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200/30 via-transparent to-transparent rounded-2xl blur opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10" />
            
//             {/* Subtle backdrop with soft edges */}
//             <div className="backdrop-blur-xs bg-white/50 p-6 md:p-8 rounded-2xl border border-blue-100/30 shadow-sm -mt-15">
//               <div className="relative">
//                 <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2A73] leading-tight">
//                   {heroTitle}
//                 </h1>

//                 <p className="mt-6 text-base md:text-lg text-slate-600 max-w-xl">
//                   {heroSubtitle}
//                 </p>

//                 <Link
//                   href="/products"
//                   className="inline-block mt-8 px-6 py-3 rounded-xl bg-[#0A2A73] text-white font-medium shadow hover:shadow-md hover:bg-blue-800 transition-all duration-300"
//                 >
//                   {heroCta}
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT IMAGE with soft border glow */}
//           {/* <div className="relative">
//             <div className="" />
//             <div className="">
//               <HeroProductImage />
//             </div>
//           </div> */}
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
//   // remove empty / null / undefined images
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

//   // safety guard
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