//ed_pharma/contextLanguageContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

// UI TEXT (PAGES)
import en from "../data1/languages/en";
import es from "../data1/languages/es";
import pt from "../data1/languages/pt";
import zh from "../data1/languages/zh";
import ar from "../data1/languages/ar";
import de from "../data1/languages/de";
import fr from "../data1/languages/fr";
import ja from "../data1/languages/ja";
import nl from "../data1/languages/nl";

// PRODUCT TEXT
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


const LANGUAGES = {
  en, es, pt, zh, ar, de, fr, ja, nl,
};

const PRODUCT_LANGUAGES = {
  en: enProducts,
  de: deProducts,
  fr: frProducts,
  es: esProducts,
  pt: ptProducts,
  nl: nlProducts,
  ja: jaProducts,
  zh: zhProducts,
  ar: arProducts,
  hr: hrProducts, 
  bs: bsProducts,
   bg: bgProducts, 
  mk: mkProducts, 
  sr: srProducts, 
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("app-lang");
    if (saved && LANGUAGES[saved]) {
      setLang(saved);
    }
  }, []);

  const changeLanguage = (code) => {
    setLang(code);
    localStorage.setItem("app-lang", code);
  };

  const getProductBySlug = (slug) => {
    return (
      PRODUCT_LANGUAGES[lang]?.[slug] ||
      PRODUCT_LANGUAGES.en?.[slug] ||
      null
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language: lang,
        changeLanguage,
        t: LANGUAGES[lang],     // UI text
        getProductBySlug,       // ✅ product text
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);









