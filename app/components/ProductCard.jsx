// components/ProductCard.jsx

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function ProductCard({ product }) {
  const { BULK_QUANTITY } = useCart();

  return (
    <Link href={`/product/${product.slug}`} className="h-full">
      <div className="bg-white border border-blue-100 p-4 rounded-xl shadow-sm hover:shadow-md transition relative h-full flex flex-col">

        {/* Badge */}
        <div className="absolute top-2 right-2 bg-[#0A4C89] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          Min {BULK_QUANTITY}
        </div>

        {/* Image */}
        <div className="h-[120px] flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            width={140}
            height={140}
            className="object-contain"
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




// components/ProductCard.jsx

// import Image from "next/image";
// import Link from "next/link";
// import { useCart } from "./CartContext";

// export default function ProductCard({ product }) {
//   const { BULK_QUANTITY } = useCart();

//   return (
//     <Link href={`/product/${product.slug}`} className="h-full">
//       <div
//         className="
//           bg-white border border-blue-100
//           p-4 rounded-lg
//           shadow hover:shadow-md
//           transition hover:-translate-y-0.5
//           relative h-full flex flex-col
//         "
//       >
//         {/* Bulk Badge */}
//         <div className="absolute top-2 right-2 bg-[#0A4C89] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
//           Min {BULK_QUANTITY}
//         </div>

//         {/* IMAGE */}
//         <div className="h-[120px] flex items-center justify-center">
//           <Image
//             src={product.image}
//             alt={product.name}
//             width={140}
//             height={140}
//             className="object-contain"
//           />
//         </div>

//         {/* NAME */}
//         <h3 className="mt-3 text-sm font-semibold text-[#0A4C89] line-clamp-2">
//           {product.name}
//         </h3>

//         {/* PRICE */}
//         <div className="flex justify-between items-center mt-auto pt-2">
//           <p className="text-[#1E73BE] font-bold text-sm">
//             ${product.price}/unit
//           </p>
//           <span className="text-[10px] text-gray-500">Bulk</span>
//         </div>
//       </div>
//     </Link>
//   );
// }






// //components\ProductCard.jsx

// import Image from "next/image";
// import Link from "next/link";
// import { useCart } from "./CartContext";

// export default function ProductCard({ product }) {
//   const { BULK_QUANTITY } = useCart();

//   return (
//     <Link href={`/product/${product.slug}`}>
//       <div className="bg-white/90 border border-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition cursor-pointer relative">
//         {/* Bulk Badge */}
//         <div className="absolute top-3 right-3 bg-[#0A4C89] text-white text-xs font-semibold px-2 py-1 rounded-full">
//           Min {BULK_QUANTITY}
//         </div>
        
//         <Image
//           src={product.image}
//           alt={product.name}
//           width={300}
//           height={300}
//           className="rounded-lg object-contain mx-auto"
//         />
//         <h3 className="mt-4 font-semibold text-lg text-[#0A4C89]">{product.name}</h3>
//         <div className="flex justify-between items-center mt-1">
//           <p className="text-[#1E73BE] font-bold">${product.price}/unit</p>
//           <span className="text-xs text-gray-500">Bulk pricing</span>
//         </div>
//       </div>
//     </Link>
//   );
// }

// import Image from "next/image";
// import Link from "next/link";
// export default function ProductCard({ product }) {
//   return (
//     <Link href={`/product/${product.slug}`}>
//       <div className="bg-white/90 border border-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
//         <Image
//           src={product.image}
//           alt={product.name}
//           width={300}
//           height={300}
//           className="rounded-lg object-contain mx-auto"
//         />
//         <h3 className="mt-4 font-semibold text-lg text-[#0A4C89]">{product.name}</h3>
//         <p className="text-[#1E73BE] font-bold mt-1">${product.price}</p>
//       </div>
//     </Link>
//   );
// }