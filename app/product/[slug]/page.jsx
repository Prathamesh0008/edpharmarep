import ProductClient from "./ProductClient";
import dbConnect from "@/lib/db";
import Product from "@/app/models/Product";

function formatProduct(product) {
  if (!product) return null;

  const translations = product.translations || {};
  const localized = translations.en || {};

  return {
    slug: product.slug || "",
    name: localized.name || product.name || product.slug || "",
    image: product.image || "/placeholder.jpg",
    price: product.price || "",
    metaTitle: localized.metaTitle || "",
    metaDescription: localized.metaDescription || "",
    description: localized.description || "",
    review: product.review || {},
  };
}

async function getProductBySlug(slug) {
  await dbConnect();
  const product = await Product.findOne({ slug }).lean();
  return formatProduct(product);
}

function generateProductSchema(product) {
  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `https://www.edpharma.co${product.image}`;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: imageUrl,
    description: product.metaDescription,
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
        `${product.name} delivered excellent and reliable results. The tablets were genuine, professionally packaged, and delivered quickly across Europe. ED Pharma offers competitive wholesale pricing and dependable service.`,
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

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    
    if (!product) {
      return {
        title: "Product Not Found | ED Pharma",
        description: "This product is not available. Browse our other high-quality pharmaceutical products.",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const title = product.metaTitle || 
                  product.name || 
                  "ED Pharma Product";
    
    const description = product.metaDescription || 
                       product.description || 
                       (product.name ? `${product.name} - High-quality pharmaceutical product from ED Pharma` : 
                       "High-quality pharmaceutical product from ED Pharma");

    const truncatedDescription = description.length > 160 
      ? description.slice(0, 157) + "..." 
      : description;

    return {
      title: title, // Your metaTitle already includes "| ED Pharma"
      description: truncatedDescription,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title: title,
        description: truncatedDescription,
        type: 'website',
        url: `https://www.edpharma.co/product/${slug}`,
        images: product.image ? [
          {
            url: product.image,
            width: 800,
            height: 600,
            alt: product.name,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: truncatedDescription,
        images: product.image ? [product.image] : [],
      },
      alternates: {
        canonical: `https://www.edpharma.co/product/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Details | ED Pharma",
      description: "View detailed information about our high-quality pharmaceutical products.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return <ProductClient slug={slug} />;
  }

  const schema = generateProductSchema(product);

  return (
    <>
      {/* ✅ JSON-LD SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <ProductClient slug={slug} />
    </>
  );
}
