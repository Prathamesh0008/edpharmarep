"use client";

import Image from "next/image";
import { Truck, Headset , Globe } from "lucide-react";

export default function HeroBanner({ heroTitle, heroSubtitle, hero = {} }) {
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
      <div className="relative px-4 sm:px-6 lg:px-8 pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px] xl:pt-[250px] flex justify-end">
  <div
    className="relative group
      w-full
      sm:w-[90%]
      md:w-[80%]
      lg:w-[70%]
      xl:w-[60%]
      2xl:w-[55%]
      mx-auto
      lg:ml-auto
      transition-all duration-500"
  >
    {/* Content Card - No bottom margin/padding */}
    <div className="backdrop-blur-md p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 rounded-xl border border-blue-100/30 shadow-sm bg-white/10 hover:bg-white/20 transition-all duration-300">
      
      {/* TITLE */}
      <h1 className="text-[#0A2A73] leading-tight
        text-xl
        sm:text-2xl
        md:text-3xl
        lg:text-4xl
        xl:text-5xl
        2xl:text-6xl
        tracking-tight">
        {heroTitle}
      </h1>

      {/* SUBTITLE */}
      <p className="mt-2 sm:mt-3 md:mt-4 text-slate-900 
        text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl
        max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl
        leading-relaxed">
        {heroSubtitle}
      </p>

      {/* BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
        
        {/* SHIPPING */}
        <div className="flex items-center justify-center gap-2 
          px-3 sm:px-4 md:px-5 lg:px-6 
          py-2 sm:py-2.5 md:py-3 
          rounded-xl bg-[#0A2A73] text-white font-medium
          shadow-md hover:shadow-lg hover:scale-[1.02] md:hover:scale-[1.03] 
          transition-all duration-300 
          text-xs sm:text-sm md:text-base lg:text-lg
          whitespace-nowrap hover:bg-[#0A2A73]/90
          w-full">
          <Truck size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 flex-shrink-0" />
          <span className="truncate">
            {hero?.expressShipping || "Express Shipping EU"}
          </span>
        </div>

        {/* TRACKING */}
        <div className="flex items-center justify-center gap-2 
          px-3 sm:px-4 md:px-5 lg:px-6 
          py-2 sm:py-2.5 md:py-3 
          rounded-xl bg-[#0A2A73] text-white font-medium
          shadow-md hover:shadow-lg hover:scale-[1.02] md:hover:scale-[1.03] 
          transition-all duration-300 
          text-xs sm:text-sm md:text-base lg:text-lg
          whitespace-nowrap hover:bg-[#0A2A73]/90
          w-full">
          <Globe size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 flex-shrink-0" />
          <span className="truncate">
            {hero?.realTimeTracking || "Real Time Tracking"}
          </span>
        </div>

        {/* CUSTOMER SERVICE */}
        <div className="flex items-center justify-center gap-2 
          px-3 sm:px-4 md:px-5 lg:px-6 
          py-2 sm:py-2.5 md:py-3 
          rounded-xl bg-[#0A2A73] text-white font-medium
          shadow-md hover:shadow-lg hover:scale-[1.02] md:hover:scale-[1.03] 
          transition-all duration-300 
          text-xs sm:text-sm md:text-base lg:text-lg
          whitespace-nowrap hover:bg-[#0A2A73]/90
          w-full sm:col-span-2 lg:col-span-1">
          <Headset size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 flex-shrink-0" />
          <span className="truncate">
            {hero?.support247 || "24/7 Support"}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
}
