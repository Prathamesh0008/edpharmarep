"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { COMPOUNDS } from "@/data/compounds";
import { useSearchParams } from "next/navigation";

//import { COMPOUNDS_DEMO as COMPOUNDS } from "@/data/compounds-demo";


// BRAND THEMES
const BRAND_THEMES = {
  "ED Ajanta Pharma": {
    name: "Ajanta Pharma",
    logo: "/bg/ajanta.png",
    primary: "#0A2A73",
    secondary: "#2A7DB8",
    bgImage: "/bg/bg9.png",
  },
  "ED Centurion Remedies": {
    name: "Centurion Remedies",
    logo: "/bg/centurion.png",
    primary: "#B69A6B",
    secondary: "#D9C7A2",
    bgImage: "/bg/bg5.png", 
  },
  "ED Sunrise Remedies": {
    name: "Sunrise Remedies",
    logo: "/bg/sunrise.png",
    primary: "#E86A0C",
    secondary: "#F6B15C",
    bgImage: "/bg/bg4.png",
  },
  Nova: {
    name: "Nova",
    logo: "/bg/nova.png",
    primary: "#081A3E",
    secondary: "#1C4A8C",
    bgImage: "/bg/bg6.png",
  },
};

const BRAND_ORDER = [
  "ED Ajanta Pharma",
  "ED Centurion Remedies",
  "ED Sunrise Remedies",
  //"Nova",
];

const makeId = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-");


// INLINE COMPOUND HEADER (Brandwise PNG Banner)
function CompoundHeader({ brand, title }) {
  if (brand === "ED Ajanta Pharma") {
    return (
      <div
  className="w-full flex justify-center mb-8 "
   // 80px navbar + 60px compact header
>
        <div
          className="bg-no-repeat bg-cover bg-center h-14 sm:h-20 md:h-24 flex items-center justify-center"
          style={{
            backgroundImage: "url('/headers/ajanta-header.svg')",
            width: "100%",
maxWidth: "700px"

,
          }}
        >
          <h2 className="text-white font-bold text-sm sm:text-xl tracking-wide">
            {title}
          </h2>
        </div>
      </div>
    );
  }

  if (brand === "ED Sunrise Remedies") {
    return (
      <div className="w-full flex justify-center mb-2 sm:mb-3">

        <div
          className="bg-no-repeat bg-cover bg-center h-14 sm:h-20 flex items-center justify-center"
          style={{
            backgroundImage: "url('/headers/sunrise-header.svg')",
            width: "100%",
maxWidth: "700px"

,
          }}
        >
          <h2 className="text-white font-bold text-sm sm:text-xl tracking-wide">
            {title}
          </h2>
        </div>
      </div>
    );
  }

  if (brand === "ED Centurion Remedies") {
    return (
      <div className="w-full flex justify-center mb-2 sm:mb-3">


        <div
          className="bg-no-repeat bg-cover bg-center h-14 sm:h-20 flex items-center justify-center"
          style={{
            backgroundImage: "url('/headers/centurion-header.svg')",
            width: "100%",
maxWidth: "700px"

,
          }}
        >
          <h2 className="text-white font-bold text-sm sm:text-xl tracking-wide">
            {title}
          </h2>
        </div>
      </div>
    );
  }

//   return (
//     <div className="w-full flex justify-center mb-2 sm:mb-3">


//       <div
//         className="bg-no-repeat bg-cover bg-center h-14 sm:h-20 flex items-center justify-center"
//         style={{
//           backgroundImage: "url('/headers/nova-header.svg')",
//           width: "100%",
// maxwidth: "700px"

// ,
//         }}
//       >
//         <h2 className="text-white font-bold text-sm sm:text-xl tracking-wide">
//           {title}
//         </h2>
//       </div>
//     </div>
//   );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const brandFromUrl = searchParams.get("brand");

const [selectedBrand, setSelectedBrand] = useState(
  BRAND_THEMES[brandFromUrl] ? brandFromUrl : "ED Ajanta Pharma"
);

  const [search, setSearch] = useState("");
  const [selectedCompound, setSelectedCompound] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [shrink, setShrink] = useState(false);

  const [activeCompound, setActiveCompound] = useState(null);
const sectionRefs = useRef({});


  const theme = BRAND_THEMES[selectedBrand];

  const COMPACT_LOCK_Y = 81; 

const scrollToCompactLock = () => {
  
  if (window.scrollY > COMPACT_LOCK_Y) {
    window.scrollTo({ top: COMPACT_LOCK_Y, behavior: "smooth" });
  }
};


  // keep selectedCompound valid when brand changes
//  useEffect(() => {
//   window.scrollTo({ top: 0, behavior: "smooth" });
// }, [search, categoryFilter, selectedCompound]);



 
  useEffect(() => {
  const compounds = Object.keys(COMPOUNDS[selectedBrand] || {});
  if (!compounds.length) return;




  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.compound;
setActiveCompound(id);

        }
      });
    },
    {
      root: null,
      rootMargin: "-120px 0px -40% 0px",
threshold: 0.15,


    }
  );

  compounds.forEach((compound) => {
    const el = sectionRefs.current[compound];
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, [selectedBrand]);

 useEffect(() => {
  const compounds = Object.keys(COMPOUNDS[selectedBrand] || {});
  if (compounds.length > 0) {
    setSelectedCompound(compounds[0]); // 🔥 THIS FIXES EVERYTHING
  } else {
    setSelectedCompound("");
  }

  setCategoryFilter("All");
  setSearch("");
}, [selectedBrand]);

useEffect(() => {
  function handleScroll() {
    setShrink(window.scrollY > 80);
  }
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
  if (brandFromUrl && BRAND_THEMES[brandFromUrl]) {
    setSelectedBrand(brandFromUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [brandFromUrl]);





  // BRAND-SPECIFIC COMPOUNDS
  const brandCompounds = COMPOUNDS[selectedBrand] || {};
  const compoundNames = Object.keys(brandCompounds);

  // 🔥 ORDER COMPOUNDS: selected one first, others continue
const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

const orderedCompounds = isDesktop && selectedCompound
  ? [
      selectedCompound,
      ...compoundNames.filter((c) => c !== selectedCompound),
    ]
  : compoundNames;



  // BRAND PRODUCTS
  const brandProducts = products.filter((p) => p.brand === selectedBrand);

  // BRAND CATEGORIES
  const brandCategories = [
    "All",
    ...new Set(brandProducts.map((p) => p.category)),
  ];

  // FILTERED PRODUCTS FOR SELECTED COMPOUND
 const compoundProducts = (() => {
  if (!selectedCompound) return [];

  const slugs = brandCompounds[selectedCompound] || [];
  let list = brandProducts.filter((p) => slugs.includes(p.slug));

  if (categoryFilter !== "All") {
    list = list.filter((p) => p.category === categoryFilter);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const description = p.description?.toLowerCase() || "";
      return name.includes(q) || description.includes(q);
    });
  }

  return list;
})();


  return (
    <div className="relative min-h-screen w-full">
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={theme.bgImage}
          alt={theme.name}
          fill
          className="object-cover object-center opacity-100"
        />
      </div>

      {/* MAIN WRAPPER */}
      <div className="max-w-7xl mx-auto px-1 py-2 md:py-2">

        {/* ========= ORIGINAL BIG HEADER (before scroll) ========= */}
        {/* ================= HERO (STICKY ALWAYS) ================= */}

  <div className="px-3 sm:px-4 py-3 flex flex-col gap-3">



    {/* LARGE HERO (visible only when !shrink) */}
    {/* =============== MAIN HERO SECTION =============== */}
<div
  className={`transition-all duration-300 ${
    shrink
      ? "opacity-0 -translate-y-3 pointer-events-none"
      : "opacity-100 translate-y-0"
  }`}
>
 <div
  className="
    grid
    grid-cols-2
    sm:grid-cols-3
    gap-4
    sm:gap-6
    mb-3
    justify-items-center
  "
>


    {BRAND_ORDER.map((brandKey) => {
      const b = BRAND_THEMES[brandKey];
      const isActive = selectedBrand === brandKey;

      return (
        <button
          key={brandKey}
          onClick={() => {
            setSelectedBrand(brandKey);
            const compounds = Object.keys(COMPOUNDS[brandKey] || {});
            setSelectedCompound(compounds[0] || null);
            setCategoryFilter("All");
            setSearch("");
          }}
          className={`flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-3 bg-white shadow transition-all ${
            isActive ? "scale-110 border-2 border-blue-600" : "opacity-70"
          }`}
        >
          <div className="relative w-12 h-12 sm:w-18 sm:h-18 mb-2">
            <Image src={b.logo} alt={b.name} fill className="object-contain" />
          </div>
          <p className="text-sm font-semibold leading-tight">{b.name}</p>
        </button>
      );
    })}
  </div>
  {/* MAIN HERO FILTERS (same as compact) */}
{/* MAIN HERO FILTER BAR */}
<div className="flex justify-center mt-2">
  <div className="
  flex 
  flex-wrap 
  items-center 
  justify-center 
  gap-2 sm:gap-3
">


    {/* SEARCH BAR */}
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search product..."
      className="
        px-3 py-1.5

        w-full sm:w-40 md:w-48
        text-xs
        rounded-lg
        border
        bg-white
        shadow-sm
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
      "
    />

    {/* COMPOUND DROPDOWN */}
    <select
  value={selectedCompound}
  onChange={(e) => {
  const value = e.target.value;
  setSelectedCompound(value);

  
//     const el = document.getElementById(`compound-${makeId(value)}`);
// if (el) {
//   const y = el.getBoundingClientRect().top + window.scrollY - 140; // sticky offset
//   window.scrollTo({ top: Math.max(COMPACT_LOCK_Y, y), behavior: "smooth" });
// }

  }}
  className="p-2 rounded-lg border text-xs bg-white shadow w-full sm:w-32"
>

      {compoundNames.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>

    {/* CATEGORY DROPDOWN */}
    <select
      value={categoryFilter}
     onChange={(e) => {
  setCategoryFilter(e.target.value);
  scrollToCompactLock();
}}

      className="
        p-2
        w-full sm:w-32
        text-xs
        rounded-lg
        border
        bg-white
        shadow-sm
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
      "
    >
      {brandCategories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>

  </div>
</div>


</div>
</div>


    {/* COMPACT HERO (visible only when shrink) */}
    {/* ======== COMPACT HERO (STICKY AFTER SCROLL) ======== */}
{shrink && (
   <div className="sticky top-[65px] z-[900]">

    {/* 🎨 INNER WRAPPER → ONLY visuals (blur allowed) */}
    <div
      className="
        bg-white/60 backdrop-blur-xl shadow-lg
        px-3 sm:px-4 md:px-6
        py-2 sm:py-2.5
        flex flex-col sm:flex-row
        gap-3 sm:gap-4 sm:items-center sm:justify-between
        transition-all duration-300
      "
    >

    <div
  className="
    flex
    items-center
    justify-center
    gap-4
    sm:gap-6
    px-1
  "
>


      {BRAND_ORDER.map((brandKey) => {
        const b = BRAND_THEMES[brandKey];
        const isActive = selectedBrand === brandKey;

        return (
          <button
            key={brandKey}
            onClick={() => {
              setSelectedBrand(brandKey);
              const c = Object.keys(COMPOUNDS[brandKey] || {});
              setSelectedCompound(c[0] || null);
              setCategoryFilter("All");
            }}
            className={`p-2 rounded-xl bg-white shadow-sm border transition-all ${
              isActive ? "scale-105 border-blue-600" : "opacity-50"
            }`}
          >
            <div className="relative w-12 h-12">
              <Image src={b.logo} alt={b.name} fill className="object-contain" />
            </div>
          </button>
        );
      })}
    </div>

    {/* SEARCH + FILTERS */}
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white border shadow w-full sm:w-32 md:w-40 text-xs"
        placeholder="Search..."
      />

     <select
  value={selectedCompound}
  onChange={(e) => {
    const value = e.target.value;
    setSelectedCompound(value);

    const el = document.getElementById(`compound-${makeId(value)}`);
    if (el) {
      const y =
  el.getBoundingClientRect().top +
  window.scrollY -
  (window.innerWidth < 640 ? 80 : window.innerWidth < 1024 ? 120 : 150);

window.scrollTo({
  top: Math.max(0, y),
  behavior: "smooth",
});

    }
  }}
  className="p-2 rounded-lg border text-xs bg-white shadow w-28"
>

        {compoundNames.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="p-2 rounded-lg border text-xs bg-white shadow w-28"
      >
        {brandCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    </div>

  </div>
)}

  

{orderedCompounds.map((compound) => {


  const slugs = brandCompounds[compound] || [];

  let items = brandProducts.filter((p) => {
  const slug = p.slug.toLowerCase();
  const name = p.name.toLowerCase();

  // 1️⃣ compound match
  // 1️⃣ compound match
const belongsToCompound = slugs.some((key) => {
  const k = key.toLowerCase();
  return k === slug || k === name;
});

// 🔥 NEW: dropdown selected compound priority
// if (selectedCompound && compound !== selectedCompound) {
//   // allow other compounds, but ONLY show if search/category applied
//   if (search.trim() || categoryFilter !== "All") {
//     return false;
//   }
// }

// final compound match
if (!belongsToCompound) return false;


  // 2️⃣ category filter
  if (categoryFilter !== "All" && p.category !== categoryFilter) {
    return false;
  }

  // 3️⃣ search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    const n = p.name?.toLowerCase() || "";
    const d = p.description?.toLowerCase() || "";
    return n.includes(q) || d.includes(q);
  }

  return true;
});


  if (!items.length) return null;

  return (
    <section
  key={compound}
  id={`compound-${makeId(compound)}`}
  data-compound={compound}   // 🔥 THIS IS THE FIX
  ref={(el) => (sectionRefs.current[compound] = el)}
  className="
    mb-20
    scroll-mt-[80px]
    sm:scroll-mt-[120px]
    lg:scroll-mt-[150px]
  "
>


      {/* Sticky only when active */}
      <div
  className="
    sticky
    z-[800]
    bg-transparent
    mb-4
    top-[65px]
    sm:top-[110px]
    lg:top-[150px]
  "
>
  <CompoundHeader brand={selectedBrand} title={compound} />
</div>









      {/* Product list */}
      <div className="space-y-10">
        {items.map((p, index) => {
          const imageLeft = index % 2 === 0;

          return (
            <div
              key={p.slug}
              className="rounded-2xl bg-white/85 backdrop-blur-sm shadow-md p-6 border"
              style={{ borderColor: `${theme.primary}40` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className={imageLeft ? "" : "md:order-2"}>
                  <div className="w-full bg-white rounded-xl border p-3 sm:p-4">

                    <Image
  src={p.image && p.image.trim() !== "" ? p.image : "/placeholder.jpg"}
  alt={p.name || "Product image"}
  width={400}
  height={300}
  className="object-contain mx-auto w-full max-h-[220px] sm:max-h-[300px]"

/>

                  </div>
                </div>

                <div className={imageLeft ? "" : "md:order-1"}>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: theme.primary }}
                  >
                    {p.name}
                  </h3>

                  <div className="text-sm text-slate-700 space-y-1 mb-3">
                    {p.dosage && <p><b>Dosage:</b> {p.dosage}</p>}
                    {p.composition && <p><b>Composition:</b> {p.composition}</p>}
                    {p.pack_size && <p><b>Pack Size:</b> {p.pack_size}</p>}
                    {p.category && <p><b>Category:</b> {p.category}</p>}
                  </div>

                  <p className="text-sm text-slate-600 mb-4">
                    {p.description?.slice(0, 220)}...
                  </p>
                  <Link
                    href={`/product/${p.slug}`}
                    className="text-sm font-semibold"
                    style={{ color: theme.primary }}
                  >
                    View Full Details →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
})}


      </div>
    </div>
  );
}