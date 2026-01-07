// app/terms/page.jsx
"use client";

import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import ScrollProgressLine from "../components/ScrollProgressLine";
import Footer from "../components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsPage() {
  const { t, language } = useLanguage(); // GET TRANSLATIONS FROM CONTEXT
  const sectionRefs = useRef([]);
  
  console.log("DEBUG Terms: Current language:", language);
  console.log("DEBUG Terms: Terms translations:", t?.termsPage);

  // Get translations from context, fallback to English structure
  const termsTranslations = t?.termsPage || {
    header: {
      title: "Terms & Conditions",
      subtitle: "These Terms & Conditions govern business-to-business access to and use of the ED_pharma website and product catalogue.",
      complianceTitle: "B2B Compliance & Verification",
      complianceText: "Access is strictly limited to licensed wholesalers, pharmacies, and authorised distributors."
    },
    terms: [
      {
        number: "01",
        title: "Scope of Use",
        text: "This website and catalogue are intended exclusively for professional counterparties such as pharmaceutical wholesalers, pharmacies, online pharmacies, clinics and licensed distributors within Europe. It is not designed for direct-to-patient sales or for individual consumers.",
        moreDetails: `Additional Information:
- Applies to all products and catalogues.
- Only licensed business entities may interact with ED_pharma.
- Regional regulations must always be followed.`
      },
      {
        number: "02",
        title: "Business Relationship",
        text: "Any quotation, order or delivery is made on the understanding that both parties operate as independent businesses. Nothing on this website creates an employment, agency or partnership relationship between ED_pharma and its customers.",
        moreDetails: `Additional Information:
- No third-party representation allowed.
- No franchise, agent or partnership status is implied.
- All contracts remain independent between both parties.`
      },
      {
        number: "03",
        title: "Product Portfolio & Availability",
        text: "ED_pharma focuses on erectile-dysfunction and sexual-health medicines manufactured by approved partners. Product range, branding, packaging and strengths may change without prior public notice and availability can vary by country or regulatory status.",
        moreDetails: `Additional Information:
- Product variations may occur depending on manufacturer updates.
- Packaging may vary by country.
- Stock availability changes daily.`
      },
      {
        number: "04",
        title: "Regulatory & Licensing Duties",
        text: "Each customer is responsible for holding and maintaining all licences, permits and registrations required to purchase, store, market and distribute medicinal products in its own territory. ED_pharma does not authorise resale into jurisdictions where products are not compliant with local regulations.",
        moreDetails: `Additional Information:
- Each customer must submit required compliance documents.
- ED_pharma may request additional regulatory certificates.
- Non-compliance may suspend operations.`
      },
      {
        number: "05",
        title: "Ordering, Pricing & Payment",
        text: "Orders are only binding once confirmed in writing by ED_pharma. Prices, currencies and payment terms are agreed on a customer-by-customer basis and may be updated in new offers or contracts. Late payment may result in suspension of deliveries or withdrawal of credit facilities.",
        moreDetails: `Additional Information:
- Multi-currency payments accepted based on agreements.
- Orders may be paused if documents or payments are delayed.
- Credit limits may apply to some buyers.`
      },
      {
        number: "06",
        title: "Delivery, Risk & Title",
        text: "Delivery terms follow the Incoterms or shipping conditions stated in the offer or invoice. Risk in the goods passes to the customer when the products are handed over to the agreed carrier or collection point; title usually transfers after full payment is received, unless otherwise agreed in writing.",
        moreDetails: `Additional Information:
- Temperature-controlled shipments follow GDP rules.
- Insurance is recommended for international shipping.
- Tracking & serialisation may apply to some medicines.`
      },
      {
        number: "07",
        title: "Quality, Storage & Returns",
        text: "Customers must store and handle products in accordance with GDP, temperature and security requirements and maintain full batch traceability. Returns are only accepted when pre-authorised by ED_pharma and where integrity, storage conditions and documentation can be verified.",
        moreDetails: `Additional Information:
- Returns only accepted with proper storage proof.
- Tampered goods cannot be accepted.
- All returns must match supplied batch numbers.`
      },
      {
        number: "08",
        title: "Pharmacovigilance & Complaints",
        text: "Suspected adverse reactions, quality defects or product complaints reported to customers must be communicated promptly to ED_pharma with all available details so they can be escalated to the relevant manufacturer and authorities where required.",
        moreDetails: `Additional Information:
- Any serious adverse event must be reported within 24 hours.
- All reports are escalated to manufacturers.
- Failure to report may restrict future orders.`
      },
      {
        number: "09",
        title: "Data Protection & Confidentiality",
        text: "Business contact data and transaction information are processed only to manage the commercial relationship, fulfil orders and comply with legal obligations. Price lists, product information and commercial terms shared by ED_pharma are confidential and must not be disclosed to unauthorised third parties.",
        moreDetails: `Additional Information:
- ED_pharma strictly follows GDPR.
- Data stored securely for regulatory reasons only.
- No data shared with third parties.`
      },
      {
        number: "10",
        title: "Intellectual Property & Changes",
        text: "All trademarks, logos, artwork and catalogue designs remain the property of ED_pharma or the respective manufacturers and may not be reproduced without written consent. ED_pharma may amend these terms and website content at any time; continued use indicates acceptance of the updated terms.",
        moreDetails: `Additional Information:
- Trademark misuse may lead to legal action.
- Catalogue layouts may change without notice.
- Custom branding requires written approval.`
      }
    ]
  };

  const header = termsTranslations?.header || {};
  const terms = termsTranslations?.terms || [];

  const scrollToSection = (index) => {
    const el = sectionRefs.current[index];
    if (!el) return;

    /* ⭐ FIX: INCREASE OFFSET SO FULL HEADING SHOWS ⭐ */
    const yOffset = -120; // <-- This is the fix  
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800 font-sans pt-24">
      {/* Debug banner - remove this after testing */}
      <div className="fixed top-20 right-4 z-50 bg-red-100 p-2 rounded shadow text-xs">
        <div>Lang: {language}</div>
        <div>Has termsPage: {t?.termsPage ? "Yes" : "No"}</div>
      </div>
      
      {/* <Navbar /> */}
      <ScrollProgressLine/>
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/ed-pharma/img3.jpg"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c4078]/10 via-transparent to-[#2d6199]/10" />
      </div>

      <div className="px-4 pb-16 pt-20 md:px-6">
        {/* HEADER SECTION */}
        <section className="mx-auto max-w-4xl mb-12 text-center">
          <h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 inline-block"
            style={{
              background: "linear-gradient(90deg, #063B8A 0%, #2A7DB8 50%, #4FB3E8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {header.title || "Terms & Conditions"}
          </h1>

          <p className="text-base md:text-lg text-slate-700 font-medium leading-relaxed">
            {header.subtitle || "These Terms & Conditions govern business-to-business access to and use of the ED_pharma website and product catalogue."}
          </p>

          <div className="mt-6 mx-auto max-w-3xl border-l-4 border-[#1c4078] bg-white/30 p-4 rounded-r-xl text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1c4078] mb-1">
              {header.complianceTitle || "B2B Compliance & Verification"}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {header.complianceText || "Access is strictly limited to licensed wholesalers, pharmacies, and authorised distributors."}
            </p>
          </div>
        </section>

        {/* SCROLLABLE SECTION */}
        <section className="mx-auto max-w-4xl">
          <div className="relative max-h-[65vh] overflow-y-auto p-2 md:p-4 custom-scrollbar">
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar { width: 6px; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #94a3b8; border-radius: 20px; }
            `}</style>

            <div className="grid gap-4">
              {terms.map((item, index) => (
                <article
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className="cursor-pointer group flex flex-col gap-5 rounded-2xl bg-white/30 backdrop-blur-sm p-5 shadow-sm hover:bg-white/80 transition-all md:flex-row"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/50 text-[#1c4078] font-black text-lg">
                    {item.number || `0${index + 1}`}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#1c4078]">
                      {item.title || "Term Title"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-800">
                      {item.text || "Term description text..."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DETAILED SECTION */}
        <section className="mx-auto max-w-4xl mt-20 space-y-16">
          {terms.map((item, index) => (
            <div
              key={index}
              ref={(el) => (sectionRefs.current[index] = el)}
            >
              <h3 className="text-3xl font-bold text-[#063B8A] mb-3">
                {item.number || `0${index + 1}`}. {item.title || "Term Title"}
              </h3>

              <p className="text-base leading-relaxed text-slate-800 whitespace-pre-line">
                {item.text || "Term description text..."}
              </p>

              {item.moreDetails && (
                <div className="mt-4 text-slate-700 text-base whitespace-pre-line leading-relaxed">
                  {item.moreDetails}
                </div>
              )}
            </div>
          ))}
          
          {/* Fallback if no terms */}
          {terms.length === 0 && (
            <div>
              <h3 className="text-3xl font-bold text-[#063B8A] mb-3">
                01. Scope of Use
              </h3>
              <p className="text-base leading-relaxed text-slate-800">
                This website and catalogue are intended exclusively for professional counterparties such as pharmaceutical wholesalers, pharmacies, online pharmacies, clinics and licensed distributors within Europe. It is not designed for direct-to-patient sales or for individual consumers.
              </p>
              <div className="mt-4 text-slate-700 text-base whitespace-pre-line leading-relaxed">
                Additional Information:
                - Applies to all products and catalogues.
                - Only licensed business entities may interact with ED_pharma.
                - Regional regulations must always be followed.
              </div>
            </div>
          )}
        </section>
      </div>
      {/* <Footer/> */}
    </div>
  );
}