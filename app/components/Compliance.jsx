"use client";

export default function Compliance() {
  const BRAND_PRIMARY = "#0A2A73";
  const BRAND_TEXT = "#334155"; // slate-700
  const BRAND_BORDER = "rgba(10, 42, 115, 0.15)";

  return (
    <section className="py-20 px-4 md:px-6  fade-up">
      {/* Heading */}
      <h2
        className="text-3xl font-bold text-center mb-12"
        style={{ color: BRAND_PRIMARY }}
      >
        Compliance, documentation & certifications
      </h2>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          {
            title: "WHO-GMP Partners",
            desc: "Manufacturing partners aligned with WHO-GMP and global quality frameworks.",
          },
          {
            title: "ISO-based systems",
            desc: "Processes built on ISO-oriented quality management and traceable documentation.",
          },
          {
            title: "Regulatory support",
            desc: "Label, COA, and batch document support for importers and distributors.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl shadow-md p-6 text-center transition hover:shadow-lg"
            style={{ border: `1px solid ${BRAND_BORDER}` }}
          >
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