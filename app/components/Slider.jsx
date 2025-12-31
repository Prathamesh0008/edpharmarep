//app\components\Slider.jsx
"use client";

import { useState, useEffect } from "react";

const categories = [
  { title: "Ajanta Pharma", desc: "Global formulations you can trust." },
  { title: "Centurion Remedies", desc: "High-quality medicines." },
  { title: "Sunrise Remedies", desc: "Innovative pharmaceutical products." },
  { title: "ED Range", desc: "Complete erectile wellness line." },
];

export default function Slider() {
  const [index, setIndex] = useState(0);

  // Auto-play every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % categories.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const next = () =>
    setIndex((i) => (i + 1) % categories.length);

  const prev = () =>
    setIndex((i) => (i - 1 + categories.length) % categories.length);

  return (
    <div className="relative max-w-xl mx-auto mt-16 fade-up">
      <div className="bg-white shadow-xl rounded-2xl p-12 text-center transition-all border border-slate-200">
        <h3 className="text-3xl font-bold text-blue-700">
          {categories[index].title}
        </h3>
        <p className="mt-3 text-slate-600">{categories[index].desc}</p>
      </div>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full"
      >
        ❮
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full"
      >
        ❯
      </button>
    </div>
  );
}
