import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const PRODUCT_PATH_PATTERN = /\/products\/.+$/i;

function getLocalProductPath(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("/")) return url;

  if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
    const { pathname } = new URL(url);
    const match = pathname.match(PRODUCT_PATH_PATTERN);
    if (match) return match[0];
  }

  return url;
}

async function ensureFileFromUrl(url, publicDir) {
  const localPath = getLocalProductPath(url);
  if (!localPath.startsWith("/products/")) {
    return { localPath, downloaded: false, skipped: true };
  }

  const targetPath = path.join(publicDir, localPath.replace(/^\//, ""));
  await fs.mkdir(path.dirname(targetPath), { recursive: true });

  try {
    await fs.access(targetPath);
    return { localPath, downloaded: false, skipped: false };
  } catch {}

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(targetPath, buffer);
  return { localPath, downloaded: true, skipped: false };
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in .env.local");
  }

  const repoRoot = process.cwd();
  const publicDir = path.join(repoRoot, "public");
  await mongoose.connect(process.env.MONGODB_URI);

  const productsCollection = mongoose.connection.collection("products");
  const ordersCollection = mongoose.connection.collection("orders");

  const products = await productsCollection
    .find({}, { projection: { image: 1, additionalImages: 1 } })
    .toArray();
  const orders = await ordersCollection
    .find({}, { projection: { items: 1 } })
    .toArray();

  const uniqueUrls = new Set();

  for (const product of products) {
    if (product.image) uniqueUrls.add(product.image);
    for (const image of product.additionalImages || []) {
      if (image) uniqueUrls.add(image);
    }
  }

  for (const order of orders) {
    for (const item of order.items || []) {
      if (item.image) uniqueUrls.add(item.image);
    }
  }

  let downloadedCount = 0;
  let skippedCount = 0;

  for (const url of uniqueUrls) {
    if (!url.includes("res.cloudinary.com")) continue;
    const result = await ensureFileFromUrl(url, publicDir);
    if (result.downloaded) downloadedCount += 1;
    if (result.skipped) skippedCount += 1;
  }

  let updatedProducts = 0;
  for (const product of products) {
    const nextImage = getLocalProductPath(product.image);
    const nextAdditionalImages = (product.additionalImages || []).map(getLocalProductPath);
    const changed =
      nextImage !== product.image ||
      JSON.stringify(nextAdditionalImages) !== JSON.stringify(product.additionalImages || []);

    if (!changed) continue;

    await productsCollection.updateOne(
      { _id: product._id },
      {
        $set: {
          image: nextImage,
          additionalImages: nextAdditionalImages,
        },
      }
    );
    updatedProducts += 1;
  }

  let updatedOrders = 0;
  for (const order of orders) {
    const nextItems = (order.items || []).map((item) => ({
      ...item,
      image: getLocalProductPath(item.image),
    }));

    if (JSON.stringify(nextItems) === JSON.stringify(order.items || [])) continue;

    await ordersCollection.updateOne(
      { _id: order._id },
      { $set: { items: nextItems } }
    );
    updatedOrders += 1;
  }

  await mongoose.disconnect();

  console.log(
    JSON.stringify(
      {
        uniqueUrls: uniqueUrls.size,
        downloadedCount,
        skippedCount,
        updatedProducts,
        updatedOrders,
      },
      null,
      2
    )
  );
}

main().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
