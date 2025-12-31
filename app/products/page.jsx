import { Suspense } from "react";
import ProductsPageInner from "./ProductsPageInner";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsPageInner />
    </Suspense>
  );
}

function ProductsSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500">Loading products...</p>
    </div>
  );
}
