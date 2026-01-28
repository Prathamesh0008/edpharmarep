// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { productImages } from "@/app/data/productImages";


// // UI TEXT (PAGES) - All 17 languages
// import en from "../data1/languages/en";
// import es from "../data1/languages/es";
// import pt from "../data1/languages/pt";
// import zh from "../data1/languages/zh";
// import ar from "../data1/languages/ar";
// import de from "../data1/languages/de";
// import fr from "../data1/languages/fr";
// import ja from "../data1/languages/ja";
// import nl from "../data1/languages/nl";
// import ro from "../data1/languages/ro";
// import sq from "../data1/languages/sq";
// import el from "../data1/languages/el";
// import bg from "../data1/languages/bg";
// import mk from "../data1/languages/mk";
// import sr from "../data1/languages/sr";
// import hr from "../data1/languages/hr";
// import bs from "../data1/languages/bs";

// // PRODUCT TEXT - All 17 languages
// import enProducts from "@/app/data/products/en";
// import deProducts from "@/app/data/products/de";
// import frProducts from "@/app/data/products/fr";
// import esProducts from "@/app/data/products/es";
// import ptProducts from "@/app/data/products/pt";
// import nlProducts from "@/app/data/products/nl";
// import jaProducts from "@/app/data/products/ja";
// import zhProducts from "@/app/data/products/zh";
// import arProducts from "@/app/data/products/ar";
// import hrProducts from "@/app/data/products/hr";
// import bsProducts from "@/app/data/products/bs";
// import bgProducts from "@/app/data/products/bg";
// import mkProducts from "@/app/data/products/mk";
// import srProducts from "@/app/data/products/sr";
// import roProducts from "@/app/data/products/ro";
// import sqProducts from "@/app/data/products/sq";
// import elProducts from "@/app/data/products/el";

// const LANGUAGES = {
//   en, es, pt, zh, ar, de, fr, ja, nl,
//   ro, sq, el, bg, mk, sr, hr, bs
// };

// // Helper function to convert your object structure to array
// const convertProductsToArray = (productsObj) => {
//   if (!productsObj) return [];
  
//   // If it's already an array, return it
//   if (Array.isArray(productsObj)) {
//     return productsObj;
//   }
  
//   // If it has a 'products' property that's an array
//   if (productsObj.products && Array.isArray(productsObj.products)) {
//     return productsObj.products;
//   }
  
//   // Convert your object structure { "slug1": {...}, "slug2": {...} } to array
//   if (typeof productsObj === 'object') {
//     const productsArray = Object.values(productsObj);
    
//     // Make sure each product has a slug (use the key if missing)
//     productsArray.forEach((product, index) => {
//       if (!product.slug && Object.keys(productsObj)[index]) {
//         product.slug = Object.keys(productsObj)[index];
//       }
//     });
    
//     return productsArray;
//   }
  
//   return [];
// };

// // Debug each language's product structure
// console.log("=== DEBUG: Checking product file structures ===");
// console.log("English products type:", typeof enProducts);
// console.log("English products keys:", Object.keys(enProducts || {}).slice(0, 3), "...");
// console.log("English products converted count:", convertProductsToArray(enProducts).length);

// const PRODUCT_LANGUAGES = {
//   en: convertProductsToArray(enProducts),
//   de: convertProductsToArray(deProducts),
//   fr: convertProductsToArray(frProducts),
//   es: convertProductsToArray(esProducts),
//   pt: convertProductsToArray(ptProducts),
//   nl: convertProductsToArray(nlProducts),
//   ja: convertProductsToArray(jaProducts),
//   zh: convertProductsToArray(zhProducts),
//   ar: convertProductsToArray(arProducts),
//   hr: convertProductsToArray(hrProducts),
//   bs: convertProductsToArray(bsProducts),
//   bg: convertProductsToArray(bgProducts),
//   mk: convertProductsToArray(mkProducts),
//   sr: convertProductsToArray(srProducts),
//   ro: convertProductsToArray(roProducts),
//   sq: convertProductsToArray(sqProducts),
//   el: convertProductsToArray(elProducts)
// };

// const LanguageContext = createContext();

// export function LanguageProvider({ children }) {
//   const [lang, setLang] = useState("en");
//   const [products, setProducts] = useState(PRODUCT_LANGUAGES.en || []);

//   // Debug on mount
//   useEffect(() => {
//     console.log("🚀 LanguageContext Initialized");
//     console.log("🌐 Current language:", lang);
//     console.log("📊 Products loaded:", products.length);
    
//     if (products.length > 0) {
//       console.log("✅ Sample product:", {
//         name: products[0].name,
//         slug: products[0].slug,
//         brand: products[0].brand,
//         category: products[0].category
//       });
      
//       // List all unique brands
//       const brands = [...new Set(products.map(p => p.brand))].filter(Boolean);
//       console.log("🏷️ Available brands:", brands);
//     }
//   }, [lang, products]);

//   // Initialize language from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("app-lang");
//     if (saved && LANGUAGES[saved]) {
//       setLang(saved);
//       setProducts(PRODUCT_LANGUAGES[saved] || PRODUCT_LANGUAGES.en);
//     }
//   }, []);

//   const changeLanguage = (code) => {
//     if (LANGUAGES[code]) {
//       setLang(code);
//       const withImages = (list) =>
//   list.map(p => ({
//     ...p,
//     images: productImages[p.slug] || {
//       main: "/placeholder.jpg",
//       gallery: [],
//     },
//   }));

// setProducts(withImages(PRODUCT_LANGUAGES[code] || PRODUCT_LANGUAGES.en));

//       localStorage.setItem("app-lang", code);
//     }
//   };

//   const attachImages = (product) => {
//   if (!product) return null;

//   return {
//     ...product,
//     images: productImages[product.slug] || {
//       main: "/placeholder.jpg",
//       gallery: [],
//     },
//   };
// };

// const getProductBySlug = (slug) => {
//   // 1️⃣ Try current language
//   const localProduct = products.find(p => p.slug === slug);
//   if (localProduct) return attachImages(localProduct);

//   // 2️⃣ Fallback to English
//   const englishProduct = PRODUCT_LANGUAGES.en.find(p => p.slug === slug);
//   return attachImages(englishProduct);
// };


//   // Get products by brand - FIXED for your structure
//   const getProductsByBrand = (brand) => {
//     console.log(`🔍 getProductsByBrand("${brand}") called`);
//     console.log(`📊 Total products in ${lang}:`, products.length);
    
//     if (!products || !Array.isArray(products)) {
//       console.log("⚠️ No products array available");
//       return [];
//     }
    
//     // Filter products by brand
//     const filteredProducts = products.filter(p => {
//       const matches = p.brand === brand;
//       return matches;
//     });
    
//     console.log(`✅ Found ${filteredProducts.length} products for "${brand}"`);
    
//     // If no products in current language, fallback to English
//     if (filteredProducts.length === 0 && lang !== "en") {
//       console.log(`🔄 No products for "${brand}" in ${lang}, checking English...`);
//       const englishProducts = PRODUCT_LANGUAGES.en || [];
//       return englishProducts.filter(p => p.brand === brand);
//     }
    
//     return filteredProducts;
//   };

//   // Get all products
//   const getAllProducts = () => {
//     return products || [];
//   };

//   // Get available languages for selector
//   const availableLanguages = [
//     { code: "en", name: "English", flag: "🇺🇸" },
//     { code: "nl", name: "Nederlands", flag: "🇳🇱" },
//     { code: "fr", name: "Français", flag: "🇫🇷" },
//     { code: "ja", name: "日本語", flag: "🇯🇵" },
//     { code: "zh", name: "中文", flag: "🇨🇳" },
//     { code: "ar", name: "العربية", flag: "🇸🇦" },
//     { code: "pt", name: "Português", flag: "🇵🇹" },
//     { code: "de", name: "Deutsch", flag: "🇩🇪" },
//     { code: "ro", name: "Română", flag: "🇷🇴" },
//     { code: "sq", name: "Shqip", flag: "🇦🇱" },
//     { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
//     { code: "bg", name: "Български", flag: "🇧🇬" },
//     { code: "mk", name: "Македонски", flag: "🇲🇰" },
//     { code: "sr", name: "Српски", flag: "🇷🇸" },
//     { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
//     { code: "bs", name: "Bosanski", flag: "🇧🇦" },
//     { code: "es", name: "Español", flag: "🇪🇸" }
//   ];

//   return (
//     <LanguageContext.Provider
//       value={{
//         language: lang,
//         changeLanguage,
//         availableLanguages,
//         t: LANGUAGES[lang] || LANGUAGES.en,
//         products,
//         getProductBySlug,
//         getProductsByBrand,
//         getAllProducts
//       }}
//     >
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export const useLanguage = () => useContext(LanguageContext);



"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { productImages } from "@/app/data/productImages";

/* ================= UI TEXT ================= */
import en from "../data1/languages/en";
import es from "../data1/languages/es";
import pt from "../data1/languages/pt";
import zh from "../data1/languages/zh";
import ar from "../data1/languages/ar";
import de from "../data1/languages/de";
import fr from "../data1/languages/fr";
import ja from "../data1/languages/ja";
import nl from "../data1/languages/nl";
import ro from "../data1/languages/ro";
import sq from "../data1/languages/sq";
import el from "../data1/languages/el";
import bg from "../data1/languages/bg";
import mk from "../data1/languages/mk";
import sr from "../data1/languages/sr";
import hr from "../data1/languages/hr";
import bs from "../data1/languages/bs";

/* ================= PRODUCTS ================= */
import enProducts from "@/app/data/products/en";
import deProducts from "@/app/data/products/de";
import frProducts from "@/app/data/products/fr";
import esProducts from "@/app/data/products/es";
import ptProducts from "@/app/data/products/pt";
import nlProducts from "@/app/data/products/nl";
import jaProducts from "@/app/data/products/ja";
import zhProducts from "@/app/data/products/zh";
import arProducts from "@/app/data/products/ar";
import hrProducts from "@/app/data/products/hr";
import bsProducts from "@/app/data/products/bs";
import bgProducts from "@/app/data/products/bg";
import mkProducts from "@/app/data/products/mk";
import srProducts from "@/app/data/products/sr";
import roProducts from "@/app/data/products/ro";
import sqProducts from "@/app/data/products/sq";
import elProducts from "@/app/data/products/el";

/* ================= CONFIG ================= */

const LANGUAGES = {
  en, es, pt, zh, ar, de, fr, ja, nl,
  ro, sq, el, bg, mk, sr, hr, bs
};

const convertProductsToArray = (obj) =>
  Array.isArray(obj) ? obj : Object.values(obj || {});

const PRODUCT_LANGUAGES = {
  en: convertProductsToArray(enProducts),
  de: convertProductsToArray(deProducts),
  fr: convertProductsToArray(frProducts),
  es: convertProductsToArray(esProducts),
  pt: convertProductsToArray(ptProducts),
  nl: convertProductsToArray(nlProducts),
  ja: convertProductsToArray(jaProducts),
  zh: convertProductsToArray(zhProducts),
  ar: convertProductsToArray(arProducts),
  hr: convertProductsToArray(hrProducts),
  bs: convertProductsToArray(bsProducts),
  bg: convertProductsToArray(bgProducts),
  mk: convertProductsToArray(mkProducts),
  sr: convertProductsToArray(srProducts),
  ro: convertProductsToArray(roProducts),
  sq: convertProductsToArray(sqProducts),
  el: convertProductsToArray(elProducts),
};

/* ================= CONTEXT ================= */

const LanguageContext = createContext();

/* ================= PROVIDER ================= */

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [products, setProducts] = useState([]);

  /* ✅ ALWAYS inject images */
  const injectImages = (list) =>
    (list || []).map((p) => ({
      ...p,
      images: productImages[p.slug] || {
        main: "/placeholder.jpg",
        gallery: [],
      },
    }));

  /* ✅ INITIAL LOAD (FIXES REFRESH BUG) */
  useEffect(() => {
    const saved = localStorage.getItem("app-lang");
    const activeLang = saved && LANGUAGES[saved] ? saved : "en";

    setLang(activeLang);
    setProducts(injectImages(PRODUCT_LANGUAGES[activeLang]));
  }, []);

  /* ✅ CHANGE LANGUAGE */
  const changeLanguage = (code) => {
    if (!LANGUAGES[code]) return;

    setLang(code);
    setProducts(injectImages(PRODUCT_LANGUAGES[code]));
    localStorage.setItem("app-lang", code);
  };

  /* ✅ SAFE PRODUCT GETTER */
  const getProductBySlug = (slug) => {
    const local = products.find((p) => p.slug === slug);
    if (local) return local;

    const fallback = PRODUCT_LANGUAGES.en.find((p) => p.slug === slug);
    return fallback
      ? injectImages([fallback])[0]
      : null;
  };

  const getProductsByBrand = (brand) =>
    products.filter((p) => p.brand === brand);

  return (
    <LanguageContext.Provider
      value={{
        language: lang,
        changeLanguage,
        availableLanguages: Object.keys(LANGUAGES),
        t: LANGUAGES[lang] || LANGUAGES.en,
        products,
        getProductBySlug,
        getProductsByBrand,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useLanguage = () => useContext(LanguageContext);
