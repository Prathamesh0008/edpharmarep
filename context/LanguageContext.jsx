"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

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

const UI_LANGUAGES = {
  en,
  es,
  pt,
  zh,
  ar,
  de,
  fr,
  ja,
  nl,
  ro,
  sq,
  el,
  bg,
  mk,
  sr,
  hr,
  bs,
};

const LANGUAGES = [
  "en",
  "ar",
  "bg",
  "bs",
  "de",
  "el",
  "es",
  "fr",
  "hr",
  "ja",
  "mk",
  "nl",
  "pt",
  "ro",
  "sq",
  "sr",
  "zh",
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (language) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/products?lang=${language}&limit=200`);
      const result = await response.json();

      if (result?.success && Array.isArray(result.data)) {
        setProducts([...result.data]);
      } else {
        console.error("Invalid products response:", result);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("app-lang");
    const activeLang = saved && LANGUAGES.includes(saved) ? saved : "en";

    setLang(activeLang);
    fetchProducts(activeLang);
  }, [fetchProducts]);

  const changeLanguage = useCallback(
    async (code) => {
      if (!LANGUAGES.includes(code)) return;

      setLang(code);
      localStorage.setItem("app-lang", code);
      await fetchProducts(code);
    },
    [fetchProducts]
  );

  const getProductBySlug = useCallback(
    (slug) => products.find((product) => product.slug === slug) || null,
    [products]
  );

  const getProductsByBrand = useCallback(
    (brand) => {
      if (!brand) return products;
      return products.filter((product) => product.brand === brand);
    },
    [products]
  );

  return (
    <LanguageContext.Provider
      value={{
        language: lang,
        changeLanguage,
        availableLanguages: LANGUAGES,
        t: UI_LANGUAGES[lang] || UI_LANGUAGES.en,
        products,
        loading,
        getProductBySlug,
        getProductsByBrand,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
