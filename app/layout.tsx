import type { Metadata } from "next";
import "./globals.css";

import LayoutController from "./components/LayoutController";
import { CartProvider } from "./components/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import LoadingProvider from "./components/LoadingProvider"; 
import RouteLoader from "./components/RouteLoader";
import WhatsAppButton from "./components/WhatsAppButton";
import VisitorTracker from "./components/VisitorTracker";
import GlobalLoader from "./components/GlobalLoader";

/* ---------------- SCHEMA MARKUP ---------------- app\components\RouteLoader.tsx */
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

const EnhancedOrganizationSchema = {
  "@context": "https://schema.org",
  "@graph": [

    {
      "@type": "Organization",
      "@id": "https://www.edpharma.co/#organization",
      "name": "ED Pharma",
      "url": "https://www.edpharma.co/",
      "logo": "https://www.edpharma.co/logo.svg",
      "description": "ED Pharma is a trusted online pharmacy offering high-quality ED medications. Buy Kamagra online, Sildenafil tablets, Tadalafil and other erectile dysfunction treatments with secure checkout and fast European delivery.",
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61587470225108",
        "https://x.com/EdpharmacyInfo",
        "https://www.instagram.com/ed__pharma/",
        "https://medium.com/@info.edpharmacy",
        "https://www.edpharma.co/",
        "https://ed-pharma.blogspot.com/"
      ],
      "keywords": [
        "buy kamagra",
        "kamagra online",
        "buy kamagra online",
        "kamagra gold",
        "sildenafil tablets",
        "tadalafil online",
        "ed medication online",
        "erectile dysfunction treatment",
        "generic viagra online",
        "buy sildenafil europe",
        "kamagra europe delivery"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "availableLanguage": [
          "English",
          "German",
          "French",
          "Spanish",
          "Italian",
          "Portuguese",
          "Dutch",
          "Polish",
          "Czech",
          "Slovak",
          "Hungarian",
          "Romanian",
          "Bulgarian",
          "Croatian",
          "Slovenian",
          "Greek",
          "Danish",
          "Swedish",
          "Finnish",
          "Norwegian",
          "Lithuanian",
          "Latvian",
          "Estonian",
          "Irish",
          "Maltese",
          "Icelandic",
          "Serbian",
          "Albanian",
          "Bosnian",
          "Ukrainian"
        ]
      }
    },

    {
      "@type": "WebSite",
      "@id": "https://www.edpharma.co/#website",
      "url": "https://www.edpharma.co/",
      "name": "ED Pharma – Buy Kamagra Online Europe",
      "description": "Buy Kamagra online in Europe from ED Pharma. Trusted supplier of Sildenafil, Tadalafil and ED medications with secure payment and fast shipping across Europe.",
      "publisher": {
        "@id": "https://www.edpharma.co/#organization"
      },
      "inLanguage": [
        "en",
        "de",
        "fr",
        "es",
        "it",
        "pt",
        "nl",
        "pl",
        "cs",
        "sk",
        "hu",
        "ro",
        "bg",
        "hr",
        "sl",
        "el",
        "da",
        "sv",
        "fi",
        "no",
        "lt",
        "lv",
        "et",
        "ga",
        "mt",
        "is",
        "sr",
        "sq",
        "bs",
        "uk"
      ],
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.edpharma.co/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }

  ]
};

/* ---------------- METADATA ---------------- */
export const metadata: Metadata = {
  title: "ED Pharma – Europe's Trusted Sexual Health Medicine Distributor & Supplier",
  description: "ED Pharma is a Europe-to-Europe distributor & supplier of high-quality erectile dysfunction and sexual health medicines. Supplying pharmacies and wholesalers with trusted pharma brands.",
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: "https://www.edpharma.co/",
  },
  verification: {
    google: "Uk8jK5E0dWbzQ3cizBgWtDWZ5B0I48zZODiasyVJu5Y",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
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
        {/* Google Search Console Verification */}
        <meta 
          name="google-site-verification" 
          content="Uk8jK5E0dWbzQ3cizBgWtDWZ5B0I48zZODiasyVJu5Y" 
        />
        
        {/* Robots Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* Google Tag Manager Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NNB2ZHQR');`
          }}
        />
        
        {/* Google Analytics Script */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KDB1YW40F8"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KDB1YW40F8');
            `
          }}
        />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema) }}
          key="breadcrumb-schema"
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(EnhancedOrganizationSchema) }}
          key="enhanced-organization-schema"
        />
      </head>
      <body
        className="antialiased"
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NNB2ZHQR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <LanguageProvider>
  <AuthProvider>
    <CartProvider>
      

        {/* 🔥 ROUTE LOADER ADDED HERE
        <RouteLoader /> */}

          {/* Simple Global Loader - No context needed */}
  <GlobalLoader />

        <LayoutController>
          
             <VisitorTracker />
          {children}
        
          <WhatsAppButton />
        </LayoutController>

      
    </CartProvider>
  </AuthProvider>
</LanguageProvider>
      </body>
    </html>
  );
}
