// components/ProductCard.jsx

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function ProductCard({ product }) {
  const { BULK_QUANTITY } = useCart();

  return (
    <Link href={`/product/${product.slug}`} className="h-full">
      <div className="bg-white border border-blue-100 p-3 rounded-xl shadow-sm hover:shadow-md transition relative h-full flex flex-col">

        {/* Badge */}
        <div className="absolute top-2 right-2 bg-[#0A4C89] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          Min {BULK_QUANTITY}
        </div>

        {/* Image */}
        <div className="h-[180px] flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            quality={100}
            className="object-contain max-h-full w-auto"
          />
        </div>

        {/* Name */}
        <h3 className="mt-3 text-sm font-semibold text-[#0A4C89] line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-auto flex justify-between items-center pt-2">
          <p className="text-[#1E73BE] font-bold text-sm">
            ${product.price}/unit
          </p>
          <span className="text-[10px] text-gray-500">Bulk</span>
        </div>
      </div>
    </Link>
  );
}

