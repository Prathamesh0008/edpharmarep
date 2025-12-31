"use client";

export default function GlobalBrandBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* base */}
      <div className="absolute inset-0 bg-[#f6f8fb]" />

      {/* simple soft hex-like pattern just with gradients */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/40 via-teal-100/40 to-transparent" />
        <div className="absolute left-[-10%] top-[35%] h-56 w-56 rounded-[40%] bg-cyan-300/35 blur-3xl" />
        <div className="absolute right-[-5%] top-[55%] h-52 w-52 rounded-[40%] bg-sky-300/35 blur-3xl" />
      </div>

      {/* top-right diagonal block */}
      <div
        className="absolute -top-28 right-[-140px] h-[360px] w-[520px] rotate-[35deg]"
        style={{
          background: "linear-gradient(90deg,#1d3f86 0%,#2e73b5 60%,#2e73b5 100%)",
          clipPath: "polygon(0 0,100% 0,100% 100%,14% 100%)",
        }}
      />

      {/* bottom-left diagonal ribbon */}
      <div
        className="absolute bottom-[-220px] left-[-220px] h-[520px] w-[820px] rotate-[-35deg]"
        style={{
          background: "linear-gradient(90deg,#0f2f73 0%,#1d4f9f 55%,#3ea0d5 100%)",
          clipPath: "polygon(0 20%,100% 0,100% 45%,0 65%)",
          filter: "drop-shadow(0 18px 24px rgba(0,0,0,.15))",
        }}
      />

      {/* circle badge */}
      <div className="absolute right-14 top-16">
        <div
          className="grid h-36 w-36 place-items-center rounded-full text-center text-white"
          style={{
            background:
              "radial-gradient(circle at 30% 30%,#2d7dbf 0%,#173d87 55%,#0e2a66 100%)",
            boxShadow: "0 12px 30px rgba(0,0,0,.18)",
          }}
        >
          <div className="text-xl font-semibold leading-6 tracking-wide">
            EUROPE
            <br />
            TO
            <br />
            EUROPE
          </div>
        </div>
      </div>
    </div>
  );
}
