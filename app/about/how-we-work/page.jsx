"use client";

import React from "react";
;
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import ScrollProgressLine from "../../components/ScrollProgressLine";
import Footer from "../../components/Footer";
import Offer from "../../components/Offer";

export default function Page() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
 <Navbar />
 <ScrollProgressLine/>
 <Offer/>
      {/* Background Image — NO BLUR */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 min-h-screen"
        aria-hidden="true"
      >
        <img
          src="/ed-pharma/bg4.jpg"
          alt="Background"
          className="w-full h-full min-h-screen object-cover brightness-75"
        />
        {/* LIGHT overlay to ensure background is visible */}
        <div className="absolute inset-0 bg-slate-900/20" />
      </div>

      {/* Foreground content */}
      <div className="px-4 pt-28 pb-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex flex-col gap-3 mb-10">
            {/* Back Button — FIRST */}
<button
  onClick={() => router.back()}
  className="w-fit flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition"
>
  ← Back
</button>

{/* Tag — BELOW Back button */}
<span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-[#1c4078] text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg">
  Europe to Europe
</span>


            {/* Main Title: Pure White with heavy drop shadow */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              How ED Pharma Works
            </h1>

            <p className="text-white font-medium max-w-2xl text-sm md:text-base drop-shadow-md">
              Structured B2B supply of ED medicines, powered by compliant,
              data-driven logistics and documentation across Europe.
            </p>
          </div>

          {/* Glass card — MODIFIED: Semi-transparent white (80%) for glass effect + readability */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_24px_80px_rgba(15,23,42,0.5)] overflow-hidden text-slate-900">

            {/* Top row */}
            <div className="px-6 md:px-10 pt-8 pb-6 grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-center border-b border-slate-300/50">
              <div>
                {/* Section Header: Dark Blue from Logo */}
                <h2 className="text-3xl font-extrabold text-[#1c4078]">
                  How We Work
                </h2>

                <p className="mt-4 text-slate-800 font-medium leading-relaxed text-sm md:text-base">
                  ED_pharma operates using a structured Europe-to-Europe B2B
                  supply model designed specifically for distributors, online
                  clinics, pharmacies, and wholesale buyers across the European
                  region. Our framework ensures compliant sourcing, stable stock
                  availability, and smooth logistics with full batch traceability.
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="relative">
                  {/* Glow matches the lighter brand blue */}
                  <div className="absolute -inset-3 bg-[#3268a0]/20 blur-xl rounded-3xl" />
                  <img
                    src="/ed-pharma/warehouse.jpg"
                    alt="ED Pharma Warehouse"
                    className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl object-cover border-4 border-white/60 shadow-xl"
                  />
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="px-6 md:px-10 pb-10 pt-6 space-y-10">

              <section>
                {/* Sub-header: Medium Brand Blue */}
                <h3 className="text-xl font-bold text-[#3268a0]">
                  Europe-to-Europe Distribution Workflow
                </h3>
                <p className="mt-3 text-slate-800 leading-relaxed text-sm md:text-base">
                  Our distribution workflow eliminates long-distance freight
                  issues by maintaining European-based stockholding…
                </p>
                <ul className="mt-4 space-y-2 list-disc ml-5 text-slate-800 font-medium leading-relaxed text-sm md:text-base">
                  <li>Short lead times for repeat orders</li>
                  <li>Faster dispatch for pharmacies and telehealth partners</li>
                  <li>Temperature-appropriate, well-documented handling</li>
                  <li>Full product compliance with EU-oriented packaging norms</li>
                  <li>Transparent batch information &amp; detailed COAs</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#3268a0]">
                  Quality &amp; Documentation Standards
                </h3>
                <p className="mt-3 text-slate-800 leading-relaxed text-sm md:text-base">
                  Every product batch is provided with complete documentation…
                </p>
                <ul className="mt-4 space-y-2 list-disc ml-5 text-slate-800 font-medium leading-relaxed text-sm md:text-base">
                  <li>Batch-specific Certificate of Analysis (COA)</li>
                  <li>GMP certificates of manufacturing sites</li>
                  <li>Packing list, invoice, and export-linked documents</li>
                  <li>Product specifications for ED class molecules</li>
                  <li>Traceability records for partner audits</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#3268a0]">
                  Forecast-Driven Inventory Planning
                </h3>
                <p className="mt-3 text-slate-800 leading-relaxed text-sm md:text-base">
                  ED_pharma works collaboratively with partners to forecast
                  stock needs…
                </p>
                <ul className="mt-4 space-y-2 list-disc ml-5 text-slate-800 font-medium leading-relaxed text-sm md:text-base">
                  <li>Reserve production slots with manufacturers</li>
                  <li>Maintain ready-to-dispatch stock</li>
                  <li>Minimise out-of-stock events</li>
                  <li>Support emergency restocking</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#3268a0]">
                  Temperature-Control &amp; Packaging Compliance
                </h3>
                <p className="mt-3 text-slate-800 leading-relaxed text-sm md:text-base">
                  ED therapies require careful handling…
                </p>
                <ul className="mt-4 space-y-2 list-disc ml-5 text-slate-800 font-medium leading-relaxed text-sm md:text-base">
                  <li>Controlled storage environments</li>
                  <li>Shock-proof packaging</li>
                  <li>Batch-specific QR traceability</li>
                  <li>Partner-ready labelling</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#3268a0]">
                  A Single Point of Contact for ED Medicines
                </h3>
                <p className="mt-3 text-slate-800 leading-relaxed text-sm md:text-base">
                  ED_pharma simplifies sourcing by acting as the primary…
                </p>
                <p className="mt-4 text-slate-800 font-semibold italic leading-relaxed text-sm md:text-base border-l-4 border-[#1c4078] pl-4">
                  Our operating model is designed for professional buyers…
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
     <Footer/>
    </div>
    
    
  );
}
