//app\about\page.jsx
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollProgressLIne from "../components/ScrollProgressLine";
import Offer from "../components/Offer";


export default function AboutPage() {
  return (
    <div
      className="bg-blue-50 "
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",

      }}
    >
      <Navbar/>
      <ScrollProgressLIne/>
      <Offer/>
      {/* Hero section */}
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 -mt-100 pt-90 lg:flex-row lg:items-center">

        {/* Text column */}
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.35em] text-sky-500">
            ABOUT US
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl bg-gradient-to-r from-sky-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
            Discover ED Pharma – Protecting Intimate Health With Expertise And Care
          </h1>

          <p className="mt-5 text-sm leading-relaxed text-slate-700">
            ED Pharma is a specialised Europe-to-Europe distributor focused on
            high-quality erectile-dysfunction and sexual-health medicines from
            trusted manufacturers such as Ajanta Pharma, Sunrise Remedies and
            Centurion.
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Our portfolio covers solid and oral-jelly formulations built around
            well-known active ingredients including Sildenafil, Tadalafil,
            Avanafil, Vardenafil and Dapoxetine, allowing partners to serve a
            broad spectrum of ED and premature-ejaculation treatment needs while
            maintaining strong safety and efficacy standards.
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Operating under the motto "Europe to Europe", we combine rigorous
            quality assurance with efficient logistics, helping wholesalers,
            pharmacies and online platforms access consistent supply from
            established Indian manufacturers while respecting local regulatory
            expectations.
          </p>
<button
  className="
    mt-7
    block mx-auto
    lg:inline-block lg:mx-0
    rounded-full 
    px-7 py-3 
    text-xs font-semibold uppercase tracking-[0.2em] 
    text-white 
    bg-[#063B8A]
    hover:bg-[#052F6B]
  "
>

  Download catalogue
</button>

        </div>

        {/* Visual card column */}
        <div className="relative w-full max-w-md self-center rounded-3xl bg-gradient-to-br from-sky-700 via-sky-500 to-cyan-400 p-1 shadow-[0_20px_60px_rgba(15,23,42,0.5)]">
          <div className="rounded-3xl bg-white p-6">
            <p className="text-xs font-semibold tracking-[0.35em] text-sky-500">
              EUROPE TO EUROPE
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              <span className="text-sky-800">ED</span>{" "}
              <span className="text-sky-500">PHARMA</span>
            </h2>

            <p className="mt-4 text-sm text-slate-700">
              Master product catalogue and distribution partner for advanced
              erectile-dysfunction therapies across Europe.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-slate-800">
              <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
                <p className="font-semibold text-slate-900">Focused portfolio</p>
                <p className="mt-1 text-[11px] text-slate-700">
                  Dedicated to ED and sexual-health therapies rather than broad
                  generic ranges.
                </p>
              </div>

              <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
                <p className="font-semibold text-slate-900">Quality assurance</p>
                <p className="mt-1 text-[11px] text-slate-700">
                  Products sourced from GMP-compliant manufacturers with proven
                  international presence.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3">
                <p className="font-semibold text-slate-900">Flexible formats</p>
                <p className="mt-1 text-[11px] text-slate-700">
                  Tablets, jellies, chewables and other patient-friendly dosage
                  forms.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3">
                <p className="font-semibold text-slate-900">Partner support</p>
                <p className="mt-1 text-[11px] text-slate-700">
                  Guidance for distributors and pharmacies on portfolio
                  selection and catalogue planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two image + info blocks */}
      <section className="mx-auto mb-16 max-w-6xl px-6">

        {/* First row */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

          {/* Left text card */}
          <div className="order-2 rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.18)] lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">
              OUR JOURNEY
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Building a dedicated ED supply network across Europe
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              ED_pharma was founded to bridge European demand for reliable
              erectile-dysfunction therapies with high-performing Indian
              manufacturers. By focusing exclusively on ED and related
              indications, we can curate a portfolio that supports wholesalers,
              pharmacies and digital clinics with depth instead of volume.
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Long-term relationships with suppliers and customers help us
              maintain continuity of supply, transparent communication and clear
              expectations on quality, packaging and documentation.
            </p>
<div className="mt-4 flex justify-center lg:justify-start">
  <Link
    href="/about/journey"
   className="
  inline-block 
  w-[90%] max-w-xs sm:w-auto
  text-center
  rounded-full 
  px-5 py-2 
  text-xs font-semibold uppercase tracking-[0.18em] 
  text-white 
  bg-[#063B8A]
  hover:bg-[#052F6B]
"

  >
    Read more
  </Link>
</div>


          </div>

          {/* Right image */}
          <div className="order-1 rounded-3xl bg-gradient-to-br from-sky-800 via-sky-600 to-cyan-400 p-[3px] shadow-[0_18px_45px_rgba(15,23,42,0.45)] lg:order-2">
            <div className="flex h-64 items-center justify-center overflow-hidden rounded-3xl bg-slate-900/80">
              <img
                src="/ed-pharma/team.jpg"
                alt="ED Pharma Team"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Second row */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">

          {/* Left image */}
          <div className="rounded-3xl bg-gradient-to-br from-sky-800 via-sky-600 to-cyan-400 p-[3px] shadow-[0_18px_45px_rgba(15,23,42,0.45)]">
            <div className="flex h-64 items-center justify-center overflow-hidden rounded-3xl bg-slate-900/80">
              <img
                src="/ed-pharma/warehouse.jpg"
                alt="ED Pharma Warehouse"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Right text card */}
          <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">
              HOW WE WORK
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Europe-to-Europe service with quality at the core
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              From forecast to final shipment, every ED_pharma order is managed
              with clear batch traceability, temperature-appropriate logistics
              and documentation aligned to European expectations.
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              The goal is to give partners a single, specialised point of
              contact for ED medicines—simplifying sourcing while protecting
              patient safety and product integrity across the supply chain.
            </p>
<div className="mt-4 flex justify-center lg:justify-start">
  <Link
    href="/about/how-we-work"
   className="
  inline-block 
  w-[90%] max-w-xs sm:w-auto
  text-center
  rounded-full 
  px-5 py-2 
  text-xs font-semibold uppercase tracking-[0.18em] 
  text-white 
  bg-[#063B8A]
  hover:bg-[#052F6B]
"


  >
    Read more
  </Link>
</div>


          </div>
        </div>
      </section>

      {/* Focus cards */}
      <section className="mx-auto mb-20 max-w-6xl px-6">

        <h3 className="text-center text-sm font-semibold tracking-[0.25em] text-sky-500">
          OUR FOCUS
        </h3>

        <p className="mt-3 text-center text-xl font-semibold text-slate-900">
          Protecting Sexual Health Across Europe
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
            <h4 className="text-base font-semibold text-slate-900">
              Specialised ED Range
            </h4>
            <p className="mt-2 text-slate-700">
              Narrow therapeutic focus on erectile-dysfunction and related
              sexual-health indications, enabling deep product knowledge and
              consistent portfolio development.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
            <h4 className="text-base font-semibold text-slate-900">
              Trusted Manufacturers
            </h4>
            <p className="mt-2 text-slate-700">
              Collaboration with established Indian manufacturers whose ED
              brands are recognised in international markets.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 text-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
            <h4 className="text-base font-semibold text-slate-900">
              European Distribution
            </h4>
            <p className="mt-2 text-slate-700">
              Europe-to-Europe logistics for reliable supply, responsive lead
              times and discrete order handling.
            </p>
          </div>

        </div>
      </section>
      <div>
     
    </div>

      <Footer/>
    </div>
  );
}