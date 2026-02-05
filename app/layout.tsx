// // app/layout.jsx (CORRECTED)
// import type { Metadata } from "next";
// import { Geist, Geist_Mono, Poppins } from "next/font/google";
// import "./globals.css";

// import GlobalBrandBackground from "./components/GlobalBrandBackground";
// import { CartProvider } from "./components/CartContext";
// import CartDrawer from "./components/CartDrawer";
// import Toast from "./components/Toast";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import ProgressBar from "./components/ProgressBar";

// // IMPORTANT: Import LanguageProvider, NOT useLanguage
// import { LanguageProvider } from "@/context/LanguageContext";
// import { AuthProvider } from "./context/AuthContext";

// /* ---------------- FONTS ---------------- */
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
// });

// /* ---------------- METADATA ---------------- */
// export const metadata: Metadata = {
//   title: "ED Pharma",
//   description: "Premium European pharmaceutical products",
// };

// /* ---------------- ROOT LAYOUT ---------------- */
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // Note: We cannot use headers() directly in layout for path detection
//   // We'll use a client-side approach instead
  
//   return (
//     <html lang="en">
//       <body
//         className={`
//           ${geistSans.variable}
//           ${geistMono.variable}
//           ${poppins.className}
//           antialiased
//         `}
//       >
//         {/* SVG Background */}
//         <div
//           className="fixed inset-0 -z-10 opacity-100 "
//           style={{
//             backgroundImage: "url('/bg/ED-banner (2).svg')",
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//             backgroundSize: "cover",
//           }}
//         />
        
//         {/* GLOBAL BRAND BACKGROUND */}
//         {/* <GlobalBrandBackground /> */}

//         {/* WRAP EVERYTHING WITH LanguageProvider AND AuthProvider */}
//         <LanguageProvider>
//           <AuthProvider>
//             <CartProvider>
//               {/* We'll handle navbar/footer hiding in a client component */}
//               <ClientLayoutWrapper>
//                {/* GLOBAL NAVBAR - Will be conditionally hidden by wrapper */}
//                 <Navbar />
                
//                 {/* PROGRESS BAR */}
//                 <ProgressBar />

//                 {/* CART DRAWER */}
//                 <CartDrawer />

//                 {/* TOAST NOTIFICATIONS */}
//                 <Toast />

//                 {/* PAGE CONTENT */}
//                 <main className="">{children}</main>

//                 {/* GLOBAL FOOTER - Will be conditionally hidden by wrapper */}
//                 <Footer />
//               </ClientLayoutWrapper>
//             </CartProvider>
//           </AuthProvider>
//         </LanguageProvider>
//       </body>
//     </html>
//   );
// }

// // Client-side wrapper to hide navbar/footer on admin routes
// function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
//   return children;
// }  


import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

import LayoutController from "./components/LayoutController";
import { CartProvider } from "./components/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

/* ---------------- FONTS ---------------- */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/* ---------------- METADATA ---------------- */
export const metadata: Metadata = {
  title: "ED Pharma – Europe’s Trusted Sexual Health Medicine Distributor & Supplier",
  description: "ED Pharma is a Europe-to-Europe distributor & supplier of high-quality erectile dysfunction and sexual health medicines. Supplying pharmacies and wholesalers with trusted pharma brands.",
   icons: {
    icon: '/Ed_logo.svg', // public\EdLogo.svg
  },
  manifest: '/site.webmanifest', // Optional: for PWA
};

/* ---------------- ROOT LAYOUT ---------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* You can also add additional meta tags here if needed */}
      </head>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${poppins.className}
          antialiased
        `}
      >
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <LayoutController>
                {children}
              </LayoutController>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
