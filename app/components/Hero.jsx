"use client";

import Image from "next/image";
import { Truck, Headset , Globe } from "lucide-react";

export default function HeroBanner({ heroTitle, heroSubtitle }) {
  return (
    <div className="relative w-full min-h-[600px] overflow-hidden">

      {/* Desktop / Tablet Banner */}
      <div className="fixed inset-0 -z-10 hidden md:block">
        <Image
          src="/bg/ED-banner (2).svg"
          alt="Pharmaceutical banner"
          fill
          priority
          sizes="100vw"
          className="object-contain object-top pt-15"
        />
      </div>

      {/* Mobile Banner */}
      <div className="fixed inset-0 -z-10 md:hidden">
        <Image
          src="/bg/mobileview.svg"
          alt="Pharmaceutical mobile banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top pt-10"
        />
      </div>

      {/* Hero Content */}
      <div className="relative px-4 sm:px-6 lg:px-8 pt-[250px] flex justify-end">

        <div
          className="relative group
          w-full
          sm:w-[85%]
          md:w-[65%]
          lg:w-[55%]
          max-w-4xl
          mx-auto
          lg:ml-auto"
        >

          {/* Content Card */}
          <div className=" backdrop-blur-md  p-4 md:p-6 lg:p-7 rounded-xl border border-blue-100/30 shadow-sm">

            {/* TITLE */}
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#0A2A73] leading-tight">
              {heroTitle}
            </h1>

            {/* SUBTITLE */}
            <p className="mt-3 text-xs sm:text-sm md:text-base lg:text-lg text-slate-900 max-w-lg">
              {heroSubtitle}
            </p>

            {/* BUTTONS */}
           <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 w-full">
  {/* SHIPPING */}
  <div className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 md:px-6 py-3 rounded-xl 
    bg-[#0A2A73] text-white font-medium
    shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300
    text-sm sm:text-base md:text-lg w-full sm:w-auto
    cursor-pointer hover:bg-[#0A2A73]/90">

    <Truck size={20} className="flex-shrink-0" />
    <span className="whitespace-nowrap">Express Shipping EU</span>

  </div>

  {/* TRACKING */}
  <div className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 md:px-6 py-3 rounded-xl 
    bg-[#0A2A73] text-white font-medium
    shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300
    text-sm sm:text-base md:text-lg w-full sm:w-auto
    cursor-pointer hover:bg-[#0A2A73]/90">

    <Globe size={20} className="flex-shrink-0" />
    <span className="whitespace-nowrap">Real Time Order Tracking</span>

  </div>

  {/* CUSTOMER SERVICE */}
  <div className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 md:px-6 py-3 rounded-xl 
    bg-[#0A2A73] text-white font-medium
    shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300
    text-sm sm:text-base md:text-lg w-full sm:w-auto
    cursor-pointer hover:bg-[#0A2A73]/90">

    <Headset size={20} className="flex-shrink-0" />
    <span className="whitespace-nowrap">24/7 Customer Support</span>

  </div>
</div>

          </div>

        </div>

      </div>

    </div>
  );
}