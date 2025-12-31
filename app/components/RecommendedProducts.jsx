//components\RecommendedProducts.jsx

"use client";
import Image from "next/image";
import Link from "next/link";

export default function RecommendedProducts({ products }) {
  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold text-[#0A4C89] mb-6">Recommended Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {products.map((product) => (
          <Link key={product.slug} href={`/product/${product.slug}`}>
            <div className="bg-white/90 border border-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
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
        ))}

      </div>
    </div>
  );
}