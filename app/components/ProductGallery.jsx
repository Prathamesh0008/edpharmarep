//components\ProductGallery.jsx

"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Main Image */}
      <div className="relative w-full max-w-lg mx-auto bg-white/80 rounded-xl shadow-xl p-6 border border-blue-100">
        <Image
          src={images[active]}
          alt="product image"
          width={600}
          height={600}
          className="rounded-lg object-contain"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 mt-6 justify-center flex-wrap">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`border-2 rounded-lg p-1 transition ${
              active === index ? "border-[#1E73BE]" : "border-gray-200"
            }`}
          >
            <Image
              src={img}
              alt="thumb"
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}