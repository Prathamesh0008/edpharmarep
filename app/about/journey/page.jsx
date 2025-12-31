"use client";

import Navbar  from "../../components/Navbar";
import { useRouter } from "next/navigation";
import ScrollProgressLine from "../../components/ScrollProgressLine";
import Footer from "../../components/Footer";
import Offer from "../../components/Offer";

export default function JourneyPage() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
 <Navbar />
 <ScrollProgressLine/>
 <Offer/>
      {/* Background Image — NO BLUR */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
      >
        <img
          src="/ed-pharma/bg4.jpg"
          alt="Background"
          className="w-full h-full object-cover brightness-75"
        />
        {/* LIGHT overlay so image remains visible */}
        <div className="absolute inset-0 bg-slate-900/20" />
      </div>

      {/* Foreground content */}
      <div className="px-4 pt-28 pb-10">

        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex flex-col gap-3 mb-10">
            {/* Back Button */}

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


            {/* Main Title: Pure White with a heavy drop shadow for contrast against background */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              Our Journey
            </h1>

            <p className="text-white font-medium max-w-2xl text-sm md:text-base drop-shadow-md">
              How ED Pharma evolved into a focused, Europe-to-Europe partner for
              ED and sexual-health therapies.
            </p>
          </div>

          {/* Glass Card — MODIFIED: Stronger Blur (3xl) + Translucent White (70%) */}
          <div className="bg-white/60 backdrop-blur-3xl border border-white/50  shadow-[0_24px_80px_rgba(15,23,42,0.5)] overflow-hidden text-slate-900">

            {/* Top Row */}
            <div className="px-6 md:px-10 pt-8 pb-6 grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-center border-b border-slate-300/60">
              <div>
                {/* Section Header: Sharp Dark Blue (Logo Color) */}
                <h2 className="text-3xl font-extrabold text-[#1c4078]">
                  Origins of ED Pharma
                </h2>
                {/* Paragraph: Dark slate/black for maximum contrast on the milky glass */}
                <p className="mt-4 text-slate-900 font-medium leading-relaxed text-sm md:text-base">
                  ED pharma was established with a single objective—create a
                  reliable, regulated, and consistent Europe-to-Europe supply
                  chain for erectile-dysfunction and sexual-health pharmaceuticals.
                  Our model is built specifically for distributors, wholesalers,
                  telehealth platforms, and licensed pharmacies that require
                  predictable sourcing, steady stock rotation, and clear
                  documentation aligned with European expectations.
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="relative">
                  {/* Glow matches the brand blue */}
                  <div className="absolute -inset-3 bg-[#3268a0]/20 blur-xl rounded-3xl" />
                  <img
                    src="/ed-pharma/team.jpg"
                    alt="ED Pharma Team"
                    className="
  relative rounded-3xl object-cover border-4 border-white/60 shadow-xl
  w-70 h-45
  md:w-52 md:h-52
  lg:w-64 lg:h-64
  xl:w-72 xl:h-72
  transition-all duration-500
"

                  />
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="px-6 md:px-10 pb-10 pt-6 space-y-10">

              <section>
                {/* Sub-headers: Medium Brand Blue */}
                <h3 className="text-xl font-bold text-[#3268a0]">
                  Building a Supplier Network With Depth
                </h3>
                <p className="mt-3 text-slate-900 leading-relaxed text-sm md:text-base">
                  Rather than offering a broad generic catalogue, ED_pharma follows
                  a specialised vertical model dedicated to ED and related
                  sexual-health molecules. This tight therapeutic focus enables us
                  to maintain:
                </p>
                <ul className="mt-4 space-y-2 list-disc ml-5 text-slate-900 font-medium leading-relaxed text-sm md:text-base">
                  <li>Long-term contracts with established GMP-certified manufacturers</li>
                  <li>Batch-consistent formulation sourcing (Sildenafil, Tadalafil, Avanafil, Vardenafil, Dapoxetine)</li>
                  <li>Spec-controlled packaging and verified export documentation</li>
                  <li>Dedicated production planning windows for ED_pharma orders</li>
                  <li>Predictable MOQ cycles for wholesalers and B2B clients</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#3268a0]">
                  European Demand, Indian Manufacturing Strength
                </h3>
                <p className="mt-3 text-slate-900 leading-relaxed text-sm md:text-base">
                  The European market continuously demands high-quality ED
                  formulations with stable supply and compliant packaging.
                  By combining Indian large-scale pharmaceutical production with
                  Europe-based logistical operations, ED_pharma ensures:
                </p>
                <ul className="mt-4 space-y-2 list-disc ml-5 text-slate-900 font-medium leading-relaxed text-sm md:text-base">
                  <li>Faster replenishment cycles for wholesalers and pharmacies</li>
                  <li>Reduced shipping complexity via Europe-to-Europe routing</li>
                  <li>Lower delays related to customs, port clearance, and long-route freight</li>
                  <li>Consistent supply for digital healthcare &amp; online clinic partners</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#3268a0]">
                  Partner-Focused Supply Operations
                </h3>
                <p className="mt-3 text-slate-900 leading-relaxed text-sm md:text-base">
                  Every partner—pharmacy, online clinic, or wholesaler—is assigned
                  a dedicated supply coordinator responsible for:
                </p>
                <ul className="mt-4 space-y-2 list-disc ml-5 text-slate-900 font-medium leading-relaxed text-sm md:text-base">
                  <li>Forecast-based production alignment</li>
                  <li>Batch-reservation and short-term stock holding</li>
                  <li>Portfolio planning for regional demand</li>
                  <li>Private-label possibilities for certain SKUs</li>
                </ul>
              </section>

              <section>
                <p className="mt-3 text-slate-900 font-bold italic leading-relaxed text-sm md:text-base border-l-4 border-[#1c4078] pl-4">
                  Our journey continues with a clear mission: strengthen the European
                  sexual-health supply chain with professionalism, predictable logistics,
                  and unmatched product depth focused on ED therapies.
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
