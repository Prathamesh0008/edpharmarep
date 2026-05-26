import dbConnect from "@/lib/db";
import Product from "@/app/models/Product";

const SITE_URL = "https://www.edpharma.co";

export default async function sitemap() {
  const now = new Date();
  const staticRoutes = [
    "",
    "/about",
    "/about/how-we-work",
    "/about/journey",
    "/blog",
    "/contact",
    "/products",
    "/terms",
  ];
  let products = [];

  try {
    await dbConnect();
    products = await Product.find({}, { slug: 1, updatedAt: 1 }).lean();
  } catch (error) {
    console.error("Sitemap product URLs skipped:", error.message);
  }

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: route === "" ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/product/${product.slug}`,
      lastModified: product.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
