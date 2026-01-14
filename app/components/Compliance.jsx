"use client";

import { useEffect, useState } from "react";

// Simple Counter component with minimal logic
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Only start once
    if (started) return;
    setStarted(true);

    let current = 0;
    const increment = target / 50; // Divide into 50 steps
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 40); // Update every 40ms (total 2000ms)

    return () => clearInterval(timer);
  }, [target, started]);

  return (
    <span>{count}{suffix}</span>
  );
}

export default function Compliance() {
  const BRAND_PRIMARY = "#0A2A73";
  const BRAND_TEXT = "#334155";
  const BRAND_BORDER = "rgba(10, 42, 115, 0.15)";

  const complianceData = [
    {
      title: "WHO-GMP Partners",
      desc: "Manufacturing partners aligned with WHO-GMP and global quality frameworks.",
      target: 25,
      suffix: "+",
    },
    {
      title: "ISO-based systems",
      desc: "Processes built on ISO-oriented quality management and traceable documentation.",
      target: 99,
      suffix: "%",
    },
    {
      title: "Regulatory support",
      desc: "Label, COA, and batch document support for importers and distributors.",
      target: 150,
      suffix: "+",
    },
  ];

  return (
    <section className="px-4 md:px-6 fade-up -mb-32">
      <h2
        className="text-3xl font-bold text-center "
        style={{ color: BRAND_PRIMARY }}
      >
        Compliance, documentation & certifications
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {complianceData.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl shadow-md p-6 text-center transition hover:shadow-lg flex flex-col items-center"
            style={{ border: `1px solid ${BRAND_BORDER}` }}
          >
            {/* Simple counter display */}
            <div className="mb-4">
              <h2 className="text-4xl md:text-5xl font-bold" style={{ color: BRAND_PRIMARY }}>
                <Counter target={item.target} suffix={item.suffix} />
              </h2>
            </div>
            
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: BRAND_PRIMARY }}
            >
              {item.title}
            </h3>

            <p
              className="text-sm leading-relaxed"
              style={{ color: BRAND_TEXT }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}