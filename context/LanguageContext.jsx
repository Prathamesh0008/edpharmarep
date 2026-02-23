
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
