// app/product/[slug]/page.jsx

import enData from "@/app/data/products/en";
import ProductClient from "./ProductClient";

/* ================= HELPER: Extract Products ================= */

function extractProducts(data) {
  if (Array.isArray(data)) return data;
  if (data?.default && Array.isArray(data.default)) return data.default;
  if (data?.products && Array.isArray(data.products)) return data.products;
  if (typeof data === "object" && data !== null)
    return Object.values(data);
  return [];
}

/* ================= HELPER: Generate Schema ================= */

function generateProductSchema(product) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: `https://www.edpharma.co${product.image}`,
    description:
      product.metaDescription ||
      product.description ||
      `${product.name} - High-quality pharmaceutical product from ED Pharma.`,
    brand: {
      "@type": "Brand",
      name: "ED Pharma",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.edpharma.co/product/${product.slug}`,
      priceCurrency: "EUR",
      price: product.price,
      priceValidUntil: "2028-01-04",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.review?.ratingValue || "5",
      ratingCount: product.review?.ratingCount || "1",
      reviewCount: product.review?.reviewCount || "1",
    },
    review: {
      "@type": "Review",
      name: product.name,
      reviewBody:
        product.review?.reviewBody ||
        `${product.name} delivered excellent and reliable results. Professionally packaged and delivered quickly across Europe. ED Pharma offers competitive pricing and dependable service.`,
      reviewRating: {
        "@type": "Rating",
        ratingValue: product.review?.ratingValue || "5",
      },
      datePublished: product.review?.datePublished || "2025-11-08",
      author: {
        "@type": "Person",
        name: product.review?.author || "John",
      },
      publisher: {
        "@type": "Organization",
        name: "ED Pharma",
      },
    },
  };
}

/* ================= METADATA ================= */

export async function generateMetadata({ params }) {
  try {
    const { slug } = params;

    const products = extractProducts(enData);
    const product = products.find((p) => p.slug === slug);

    if (!product) {
      return {
        title: "Product Not Found | ED Pharma",
        description:
          "This product is not available. Browse our other high-quality pharmaceutical products.",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const title =
      product.metaTitle || product.name || "ED Pharma Product";

    const description =
      product.metaDescription ||
      product.description ||
      `${product.name} - High-quality pharmaceutical product from ED Pharma.`;

    const truncatedDescription =
      description.length > 160
        ? description.slice(0, 157) + "..."
        : description;

    return {
      title,
      description: truncatedDescription,
      alternates: {
        canonical: `https://www.edpharma.co/product/${slug}`,
      },
      openGraph: {
        title,
        description: truncatedDescription,
        type: "website",
        url: `https://www.edpharma.co/product/${slug}`,
        images: product.image
          ? [
              {
                url: `https://www.edpharma.co${product.image}`,
                width: 800,
                height: 600,
                alt: product.name,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: truncatedDescription,
        images: product.image
          ? [`https://www.edpharma.co${product.image}`]
          : [],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "Product Details | ED Pharma",
      description:
        "View detailed information about our high-quality pharmaceutical products.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

/* ================= PAGE ================= */

export default async function ProductPage({ params }) {
  const { slug } = params;

  const products = extractProducts(enData);
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return <ProductClient slug={slug} />;
  }

  const schema = generateProductSchema(product);

  return (
    <>
      {/* ✅ JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      {/* ✅ Client UI */}
      <ProductClient slug={slug} />
    </>
  );
}