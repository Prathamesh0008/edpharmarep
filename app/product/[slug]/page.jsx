//app\product\[slug]\page.jsx
import Image from "next/image";
import Link from "next/link";
import { products } from "../../data/products";
import ProductActions from "../../components/ProductActions";





export default async function ProductPage({ params }) {
  

  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  

  if (!product) {
    return (
      <div className="p-20 text-center text-xl text-gray-600">
        Product not found
      </div>
    );
  }

  /* ================= BRAND THEMES (SAME LOGIC AS PRODUCT PAGE) ================= */
  const BRAND_THEMES = {
    "ED Ajanta Pharma": {
      primary: "#0A2A73",
      secondary: "#2A7DB8",
      bg: "/bg/bg6.png",
    },
    "ED Sunrise Remedies": {
      primary: "#E86A0C",
      secondary: "#F6B15C",
      bg: "/bg/bg4.png",
    },
    "ED Centurion Remedies": {
      primary: "#B69A6B",
      secondary: "#D9C7A2",
      bg: "/bg/bg5.png",
    },
  };

  const theme = BRAND_THEMES[product.brand] || {
    primary: "#1E3A8A",
    secondary: "#3B82F6",
    bg: "/bg/bg1.png",
  };

  

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* 🔵 FIXED BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <img
          src={theme.bg}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* BACK BUTTON */}
      <div className="max-w-6xl mx-auto mb-6 px-4">
        <Link
  href={`/products?brand=${encodeURIComponent(product.brand)}`}
  className="inline-flex items-center gap-2 font-medium hover:underline"
  style={{ color: theme.primary }}
>
  ← Back to Products
</Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start animate-fadeIn">

        {/* PRODUCT IMAGE */}
        <div className="flex justify-center w-full">
          <div
             className="
    p-6 sm:p-8
    rounded-2xl
    bg-white
    shadow-xl
    border
    transition
    w-90
    max-w-lg
    md:max-w-xl
    lg:max-w-2xl
  "
            style={{ borderColor: `${theme.primary}40` }}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-xl object-contain w-full h-auto"
            />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug"
            style={{ color: theme.primary }}
          >
            {product.name}
          </h1>

          <div className="mt-4 space-y-1 text-gray-700 text-base sm:text-lg">
            <p>
              <span className="font-semibold" style={{ color: theme.primary }}>
                Category:
              </span>{" "}
              {product.category}
            </p>

            <p>
              <span className="font-semibold" style={{ color: theme.primary }}>
                Brand:
              </span>{" "}
              {product.brand}
            </p>
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed text-sm sm:text-base">
            {product.description}
          </p>

          {/* PRICE */}
          {product.price && (
            <p
              className="text-3xl sm:text-3xl font-semibold mt-8"
              style={{ color: theme.secondary }}
            >
              ₹ {product.price}
            </p>
          )}

          {/* ACTION BUTTONS */}
          <ProductActions product={product} theme={theme} />

        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="max-w-6xl mx-auto mt-16 px-4 space-y-12 sm:space-y-16">
        {product.overview && (
          <Section
            title="Overview"
            items={product.overview}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}

/* ================= REUSABLE SECTION ================= */
function Section({ title, items, theme }) {
  return (
    <section
      className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border animate-slideUp"
      style={{ borderColor: `${theme.primary}30` }}
    >
      <h2
        className="text-xl sm:text-2xl font-bold mb-4"
        style={{ color: theme.primary }}
      >
        {title}
      </h2>

      <ul className="list-disc ml-5 sm:ml-6 space-y-2 text-gray-700 text-sm sm:text-base leading-relaxed">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
