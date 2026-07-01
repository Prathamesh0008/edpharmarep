const PRODUCT_PATH_PATTERN = /\/products\/.+$/i;

export function getProductImagePath(url, fallback = "/placeholder.jpg") {
  if (!url || typeof url !== "string") return fallback;
  if (url.startsWith("/")) return url;

  if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
    try {
      const { pathname } = new URL(url);
      const productPathMatch = pathname.match(PRODUCT_PATH_PATTERN);
      if (productPathMatch) {
        return productPathMatch[0];
      }
    } catch {
      return fallback;
    }
  }

  return url;
}

export function getProductImagePaths(urls = [], fallback = "/placeholder.jpg") {
  return urls
    .map((url) => getProductImagePath(url, fallback))
    .filter(Boolean);
}

export function toAbsoluteProductImageUrl(url, baseUrl = "https://www.edpharma.co") {
  const normalized = getProductImagePath(url);
  if (!normalized) return "";
  if (normalized.startsWith("http")) return normalized;
  return `${baseUrl}${normalized}`;
}
