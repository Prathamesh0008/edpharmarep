export function optimizeCloudinaryImage(url, width = 800) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }

  const transformation = `f_auto,q_auto,c_limit,w_${width}`;
  if (url.includes(`/image/upload/${transformation}/`)) return url;

  return url.replace("/image/upload/", `/image/upload/${transformation}/`);
}

export function optimizeCloudinaryImages(urls = [], width = 800) {
  return urls.filter(Boolean).map((url) => optimizeCloudinaryImage(url, width));
}
