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

/* ---------------- SCHEMA MARKUP ---------------- */
const BreadcrumbSchema = {
  "@context": "https://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://www.edpharma.co/"
  }, {
    "@type": "ListItem",
    "position": 2,
    "name": "Products",
    "item": "https://www.edpharma.co/products"
  }]
};

const OrganizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.edpharma.co/#organization",
      "name": "ED Pharma",
      "url": "https://www.edpharma.co/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.edpharma.co/logoed.svg",
        "width": 600,
        "height": 60
      },
      "description": "ED Pharma is an online pharmaceutical retailer offering a wide range of health and wellness products to customers.",
      "sameAs": [
        "https://www.instagram.com/ed__pharma/",
        "https://www.facebook.com/profile.php?id=61587470225108",
        "https://x.com/EdpharmacyInfo"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.edpharma.co/#website",
      "url": "https://www.edpharma.co/",
      "name": "ED Pharma",
      "publisher": {
        "@id": "https://www.edpharma.co/#organization"
      }
    }
  ]
};

/* ---------------- METADATA ---------------- */
export const metadata: Metadata = {
  title: "ED Pharma – Europe's Trusted Sexual Health Medicine Distributor & Supplier",
  description: "ED Pharma is a Europe-to-Europe distributor & supplier of high-quality erectile dysfunction and sexual health medicines. Supplying pharmacies and wholesalers with trusted pharma brands.",
  icons: {
    icon: '/Ed_logo.svg',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: "https://www.edpharma.co/",
  },
  
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
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema) }}
          key="breadcrumb-schema"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(OrganizationSchema) }}
          key="organization-schema"
        />
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