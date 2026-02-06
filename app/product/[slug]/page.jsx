// app/product/[slug]/page.jsx
import enData from "@/app/data/products/en";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    
    // Try to extract products from the imported data
    let enProducts = [];
    
    if (Array.isArray(enData)) {
      enProducts = enData;
    } else if (enData && Array.isArray(enData.default)) {
      enProducts = enData.default;
    } else if (enData && Array.isArray(enData.products)) {
      enProducts = enData.products;
    } else if (typeof enData === 'object' && enData !== null) {
      // If enData is an object with product slugs as keys
      enProducts = Object.values(enData);
    }
    
    console.log("DEBUG: Looking for product with slug:", slug);
    console.log("DEBUG: Total products available:", enProducts.length);
    
    const product = enProducts.find((p) => p.slug === slug);
    
    if (!product) {
      console.log("DEBUG: Product not found for slug:", slug);
      return {
        title: "Product Not Found | ED Pharma",
        description: "This product is not available. Browse our other high-quality pharmaceutical products.",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    console.log("DEBUG: Product found:", product.name);
    console.log("DEBUG: metaTitle:", product.metaTitle);
    console.log("DEBUG: metaDescription:", product.metaDescription);

    // Use the exact property names from your data
    const title = product.metaTitle || 
                  product.name || 
                  "ED Pharma Product";
    
    const description = product.metaDescription || 
                       product.description || 
                       (product.name ? `${product.name} - High-quality pharmaceutical product from ED Pharma` : 
                       "High-quality pharmaceutical product from ED Pharma");

    // Truncate description if it's too long (160-320 characters is optimal)
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
        url: `https://edpharma.com/product/${slug}`,
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
        canonical: `https://edpharma.com/product/${slug}`,
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
  return <ProductClient slug={slug} />;
}