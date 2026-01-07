//context/LanguageContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

// UI TEXT (PAGES) - All 17 languages
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

// PRODUCT TEXT - All 17 languages
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

const LANGUAGES = {
  en, es, pt, zh, ar, de, fr, ja, nl,
  ro, sq, el, bg, mk, sr, hr, bs
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
  ro: roProducts,
  sq: sqProducts,
  el: elProducts
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
    if (LANGUAGES[code]) {
      setLang(code);
      localStorage.setItem("app-lang", code);
    }
  };

  const getProductBySlug = (slug) => {
    return (
      PRODUCT_LANGUAGES[lang]?.[slug] ||
      PRODUCT_LANGUAGES.en?.[slug] ||
      null
    );
  };

  // Get available languages for selector
  const availableLanguages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ro", name: "Română", flag: "🇷🇴" },
    { code: "sq", name: "Shqip", flag: "🇦🇱" },
    { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
    { code: "bg", name: "Български", flag: "🇧🇬" },
    { code: "mk", name: "Македонски", flag: "🇲🇰" },
    { code: "sr", name: "Српски", flag: "🇷🇸" },
    { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
    { code: "bs", name: "Bosanski", flag: "🇧🇦" },
    { code: "es", name: "Español", flag: "🇪🇸" }
  ];

  return (
    <LanguageContext.Provider
      value={{
        language: lang,
        changeLanguage,
        availableLanguages,
        t: LANGUAGES[lang] || LANGUAGES.en,
        getProductBySlug,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);