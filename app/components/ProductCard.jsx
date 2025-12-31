//components\ProductCard.jsx

import Image from "next/image";
import Link from "next/link";
export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.slug}`}>
      <div className="bg-white/90 border border-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="rounded-lg object-contain mx-auto"
        />
        <h3 className="mt-4 font-semibold text-lg text-[#0A4C89]">{product.name}</h3>
        <p className="text-[#1E73BE] font-bold mt-1">${product.price}</p>
      </div>
    </Link>
  );
}