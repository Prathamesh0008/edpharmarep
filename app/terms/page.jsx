// // app/terms/page.jsx

// app/terms/page.jsx
"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  ShieldCheck,
  FileText,
  Building2,
  Users,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Lock,
  Award,
  FileSignature,
  Eye,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const { t } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState(null);

  // Offer page colors
  const colors = {
    primary: "#20396f",
    accent: "#326a9f",
  };

  // Get translations with fallbacks
  const termsTranslations = t?.termsPage || {
    header: {
      title: "Terms & Conditions",
      subtitle: "B2B Pharmaceutical Distribution Framework",
      description: "These Terms & Conditions govern business-to-business access to and use of the ED pharma website and product catalogue.",
      lastUpdated: "Last Updated: January 2026",
      version: "v2.4.1"
    },
    terms: [
      {
        number: "01",
        title: "Scope of Use",
        category: "General Terms",
        icon: "building",
        text: "This website and catalogue are intended exclusively for professional counterparties such as pharmaceutical wholesalers, pharmacies, online pharmacies, clinics and licensed distributors within Europe. It is not designed for direct-to-patient sales or for individual consumers.",
        keyPoints: [
          "B2B access only",
          "Licensed business entities",
          "Regional compliance required",
          "Professional use exclusively"
        ]
      },
      {
        number: "02",
        title: "Business Verification",
        category: "Access Control",
        icon: "shield",
        text: "All users must provide valid business credentials and licensing documentation prior to accessing our product catalogue and ordering systems.",
        keyPoints: [
          "Business license verification",
          "Professional credentials required",
          "Ongoing compliance checks",
          "Right to audit access"
        ]
      },
      {
        number: "03",
        title: "Data Protection",
        category: "Privacy & Security",
        icon: "lock",
        text: "We handle all business data in accordance with GDPR and maintain strict confidentiality protocols for all partner information.",
        keyPoints: [
          "GDPR compliant",
          "Encrypted data transmission",
          "Secure storage systems",
          "Regular security audits"
        ]
      },
      {
        number: "04",
        title: "Ordering & Distribution",
        category: "Commercial Terms",
        icon: "award",
        text: "All orders are subject to availability, minimum order quantities, and our standard distribution agreements for B2B pharmaceutical supply.",
        keyPoints: [
          "Minimum order quantities apply",
          "Subject to availability",
          "Standard lead times",
          "Territory restrictions"
        ]
      },
      {
        number: "05",
        title: "Intellectual Property",
        category: "Legal Protection",
        icon: "file",
        text: "All product information, images, and documentation remain the intellectual property of ED Pharma and licensed partners.",
        keyPoints: [
          "Protected trademarks",
          "Copyright materials",
          "Restricted usage rights",
          "Attribution requirements"
        ]
      },
      {
        number: "06",
        title: "Liability & Warranties",
        category: "Legal Framework",
        icon: "signature",
        text: "Product warranties and liability terms are governed by applicable pharmaceutical regulations and our standard commercial agreements.",
        keyPoints: [
          "Regulatory compliance",
          "Product quality guarantees",
          "Limitation of liability",
          "Dispute resolution process"
        ]
      }
    ]
  };

  const header = termsTranslations?.header || {};
  const terms = termsTranslations?.terms || [];

  const iconMap = {
    building: Building2,
    shield: ShieldCheck,
    lock: Lock,
    award: Award,
    file: FileText,
    signature: FileSignature,
    users: Users,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-25 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-40"
          style={{ background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.accent}20 100%)` }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{ background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.accent}15 100%)` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 bg-white shadow-xl border"
                style={{ borderColor: `${colors.primary}20` }}
              >
                <Sparkles className="w-5 h-5" style={{ color: colors.accent }} />
                <span className="text-sm font-bold tracking-wide" style={{ color: colors.primary }}>LEGAL FRAMEWORK</span>
                <div 
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}
                >
                  {header.version}
                </div>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                <span 
                  className="bg-clip-text text-transparent"
                  style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`, WebkitBackgroundClip: "text" }}
                >
                  {header.title} 
                </span>
              </h1>

              <p className="text-xl md:text-xl text-gray-600 mb-4 font-medium max-w-3xl mx-auto">
                {header.subtitle}
              </p>

              <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                {header.lastUpdated}
              </p>

              {/* Card for Description */}
              <div className="mt-12 max-w-4xl mx-auto p-8 rounded-3xl bg-white shadow-2xl border hover:bg-gray-50 transition-colors duration-300"
                style={{ borderColor: `${colors.primary}20` }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ background: `${colors.primary}10` }}
                  >
                    <AlertCircle className="w-6 h-6" style={{ color: colors.accent }} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>
                      B2B Compliance & Verification Required
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {header.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 max-w-5xl mx-auto">
              {[
                { icon: FileText, label: "Sections", value: terms.length },
                { icon: ShieldCheck, label: "GDPR Compliant", value: "100%" },
                { icon: Building2, label: "B2B Only", value: "✓" },
                { icon: Award, label: "EU Certified", value: "✓" }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-50 cursor-pointer border"
                  style={{ borderColor: `${colors.primary}20` }}
                >
                  <stat.icon className="w-8 h-9 mb-3 mx-auto" style={{ color: colors.accent }} />
                  <div className="text-2xl text-center font-black mb-1" style={{ color: colors.primary }}>{stat.value}</div>
                  <div className="text-sm text-center text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Terms Cards - Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {terms.map((term, index) => {
                const Icon = iconMap[term.icon] || FileText;
                const isHovered = hoveredCard === index;
                
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group relative"
                  >
                    {/* Glow effect on hover */}
                    {isHovered && (
                      <div
                        className="absolute -inset-1 rounded-3xl blur-xl opacity-50"
                        style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}
                      />
                    )}

                    {/* Card */}
                    <div 
                      className="relative h-full p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border hover:bg-gray-50 cursor-pointer"
                      style={{ borderColor: `${colors.primary}20` }}
                    >
                      {/* Gradient overlay */}
                      <div 
                        className="absolute top-0 right-0 w-32 h-32 rounded-bl-full"
                        style={{ background: `linear-gradient(135deg, ${colors.accent}10 0%, transparent 100%)` }}
                      />

                      {/* Header */}
                      <div className="relative mb-6">
                        <div className="flex items-start justify-between mb-4">
                          <div 
                            className="p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                            style={{ background: `${colors.primary}10` }}
                          >
                            <Icon className="w-7 h-7" style={{ color: colors.accent }} />
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm text-gray-400 mb-1">
                              {term.number}
                            </div>
                            <div 
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ background: `${colors.primary}10`, color: colors.accent }}
                            >
                              {term.category}
                            </div>
                          </div>
                        </div>

                        <h3 className="text-2xl font-black mb-3" style={{ color: colors.primary }}>
                          {term.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed text-sm mb-6">
                          {term.text}
                        </p>
                      </div>

                      {/* Key Points */}
                      <div className="space-y-2 mb-6">
                        {term.keyPoints?.slice(0, 3).map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />
                            <span className="text-gray-600">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Details Section - Expandable Panels */}
            <div className="mt-24 max-w-5xl mx-auto space-y-6">
              <h2 className="text-4xl font-black mb-12 text-center" style={{ color: colors.primary }}>
                Complete Terms Documentation
              </h2>

              {terms.map((term, index) => {
                const Icon = iconMap[term.icon] || FileText;
                
                return (
                  <details
                    key={index}
                    className="group bg-white border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:bg-gray-50 cursor-pointer"
                    style={{ borderColor: `${colors.primary}20` }}
                  >
                    <summary className="cursor-pointer p-8 list-none flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div 
                          className="p-3 rounded-xl"
                          style={{ background: `${colors.primary}10` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: colors.accent }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-gray-400">{term.number}</span>
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ background: `${colors.primary}10`, color: colors.accent }}
                            >
                              {term.category}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
                            {term.title}
                          </h3>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>

                    <div className="px-8 pb-8 pt-4 border-t" style={{ borderColor: `${colors.primary}20` }}>
                      <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                        {term.text}
                      </p>

                      {/* Key Points Expanded */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {term.keyPoints?.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${colors.primary}5` }}>
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: colors.accent }} />
                            <span className="text-gray-700 text-sm">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}







// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useLanguage } from "@/context/LanguageContext";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { 
//   ShieldCheck,
//   FileText,
//   Building2,
//   Users,
//   AlertCircle,
//   CheckCircle2,
//   ArrowRight,
//   Sparkles,
//   Lock,
//   Award,
//   FileSignature,
//   Download,
//   Mail,
//   Eye,
//   ChevronRight,
//   Info
// } from "lucide-react";

// export default function TermsPage() {
//   const { t, language } = useLanguage();
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const containerRef = useRef(null);
  
//   const { scrollYProgress } = useScroll();
//   const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

//   // Offer page colors
//   const colors = {
//     primary: "#20396f",
//     accent: "#326a9f",
//   };

//   // Get translations with fallbacks
//   const termsTranslations = t?.termsPage || {
//     header: {
//       title: "Terms & Conditions",
//       subtitle: "B2B Pharmaceutical Distribution Framework",
//       description: "These Terms & Conditions govern business-to-business access to and use of the ED pharma website and product catalogue.",
//       lastUpdated: "Last Updated: January 2026",
//       version: "v2.4.1"
//     },
//     terms: [
//       {
//         number: "01",
//         title: "Scope of Use",
//         category: "General Terms",
//         icon: "building",
//         text: "This website and catalogue are intended exclusively for professional counterparties such as pharmaceutical wholesalers, pharmacies, online pharmacies, clinics and licensed distributors within Europe. It is not designed for direct-to-patient sales or for individual consumers.",
//         keyPoints: [
//           "B2B access only",
//           "Licensed business entities",
//           "Regional compliance required",
//           "Professional use exclusively"
//         ]
//       },
//       {
//         number: "02",
//         title: "Business Verification",
//         category: "Access Control",
//         icon: "shield",
//         text: "All users must provide valid business credentials and licensing documentation prior to accessing our product catalogue and ordering systems.",
//         keyPoints: [
//           "Business license verification",
//           "Professional credentials required",
//           "Ongoing compliance checks",
//           "Right to audit access"
//         ]
//       },
//       {
//         number: "03",
//         title: "Data Protection",
//         category: "Privacy & Security",
//         icon: "lock",
//         text: "We handle all business data in accordance with GDPR and maintain strict confidentiality protocols for all partner information.",
//         keyPoints: [
//           "GDPR compliant",
//           "Encrypted data transmission",
//           "Secure storage systems",
//           "Regular security audits"
//         ]
//       },
//       {
//         number: "04",
//         title: "Ordering & Distribution",
//         category: "Commercial Terms",
//         icon: "award",
//         text: "All orders are subject to availability, minimum order quantities, and our standard distribution agreements for B2B pharmaceutical supply.",
//         keyPoints: [
//           "Minimum order quantities apply",
//           "Subject to availability",
//           "Standard lead times",
//           "Territory restrictions"
//         ]
//       },
//       {
//         number: "05",
//         title: "Intellectual Property",
//         category: "Legal Protection",
//         icon: "file",
//         text: "All product information, images, and documentation remain the intellectual property of ED Pharma and licensed partners.",
//         keyPoints: [
//           "Protected trademarks",
//           "Copyright materials",
//           "Restricted usage rights",
//           "Attribution requirements"
//         ]
//       },
//       {
//         number: "06",
//         title: "Liability & Warranties",
//         category: "Legal Framework",
//         icon: "signature",
//         text: "Product warranties and liability terms are governed by applicable pharmaceutical regulations and our standard commercial agreements.",
//         keyPoints: [
//           "Regulatory compliance",
//           "Product quality guarantees",
//           "Limitation of liability",
//           "Dispute resolution process"
//         ]
//       }
//     ]
//   };

//   const header = termsTranslations?.header || {};
//   const terms = termsTranslations?.terms || [];

//   // Mouse move effect for gradient
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   const iconMap = {
//     building: Building2,
//     shield: ShieldCheck,
//     lock: Lock,
//     award: Award,
//     file: FileText,
//     signature: FileSignature,
//     users: Users,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-25 relative overflow-hidden">
//       {/* Background Elements - Same as About Us */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div 
//           className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-40"
//           style={{ background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.accent}20 100%)` }}
//         ></div>
//         <div 
//           className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-30"
//           style={{ background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.accent}15 100%)` }}
//         ></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10" ref={containerRef}>
//         {/* Hero Section */}
//         <section className="pt-32 pb-20 px-4 md:px-6">
//           <div className="max-w-7xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-center mb-20"
//             >
//               {/* Badge */}
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.2, type: "spring" }}
//                 className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 bg-white shadow-xl border"
//                 style={{ borderColor: `${colors.primary}20` }}
//               >
//                 <Sparkles className="w-5 h-5" style={{ color: colors.accent }} />
//                 <span className="text-sm font-bold tracking-wide" style={{ color: colors.primary }}>LEGAL FRAMEWORK</span>
//                 <div 
//                   className="px-3 py-1 rounded-full text-xs font-bold text-white"
//                   style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}
//                 >
//                   {header.version}
//                 </div>
//               </motion.div>

//               {/* Main Title */}
//               <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
//                 <span 
//                   className="bg-clip-text text-transparent"
//                   style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`, WebkitBackgroundClip: "text" }}
//                 >
//                   {header.title}
//                 </span>
//               </h1>

//               <p className="text-xl md:text-xl text-gray-800 mb-4 font-bold max-w-3xl mx-auto">
//                 {header.subtitle}
//               </p>

//               <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
//                 <Eye className="w-4 h-4" />
//                 {header.lastUpdated}
//               </p>

//               {/* Card for Description - Same style as About Us */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="mt-12 max-w-4xl mx-auto p-8 rounded-3xl bg-white shadow-2xl border transition-all duration-300 hover:bg-gray-50"
//                 style={{ borderColor: `${colors.primary}20` }}
//               >
//                 <div className="flex items-start gap-4">
//                   <div 
//                     className="p-3 rounded-xl transition-colors duration-300"
//                     style={{ background: `${colors.primary}10` }}
//                   >
//                     <AlertCircle className="w-6 h-6" style={{ color: colors.accent }} />
//                   </div>
//                   <div className="flex-1 text-left">
//                     <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>
//                       B2B Compliance & Verification Required
//                     </h3>
//                     <p className="text-gray-600  leading-relaxed">
//                       {header.description}
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* Stats Bar - Same style as About Us */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//               className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 max-w-5xl mx-auto"
//             >
//               {[
//                 { icon: FileText, label: "Sections", value: terms.length },
//                 { icon: ShieldCheck, label: "GDPR Compliant", value: "100%" },
//                 { icon: Building2, label: "B2B Only", value: "✓" },
//                 { icon: Award, label: "EU Certified", value: "✓" }
//               ].map((stat, index) => (
//                 <motion.div
//                   key={index}
//                   whileHover={{ scale: 1.05, y: -4 }}
//                   className="p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-50 cursor-pointer border"
//                   style={{ borderColor: `${colors.primary}20` }}
//                 >
//                   <stat.icon className="w-8 h-9 mb-3 mx-auto" style={{ color: colors.accent }} />
//                   <div className="text-2xl text-center font-black mb-1" style={{ color: colors.primary }}>{stat.value}</div>
//                   <div className="text-sm text-center text-gray-600">{stat.label}</div>
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Terms Cards - Grid with hover effects */}
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
//               {terms.map((term, index) => {
//                 const Icon = iconMap[term.icon] || FileText;
//                 const isHovered = hoveredCard === index;
                
//                 return (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.1 * index, duration: 0.6 }}
//                     onHoverStart={() => setHoveredCard(index)}
//                     onHoverEnd={() => setHoveredCard(null)}
//                     whileHover={{ y: -8 }}
//                     className="group relative"
//                   >
//                     {/* Glow effect on hover - Same as About Us */}
//                     {isHovered && (
//                       <motion.div
//                         layoutId="cardGlow"
//                         className="absolute -inset-1 rounded-3xl blur-xl opacity-50"
//                         style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}
//                         transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                       />
//                     )}

//                     {/* Card - Same style as About Us cards */}
//                     <div 
//                       className="relative h-full p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border hover:bg-gray-50 cursor-pointer"
//                       style={{ borderColor: `${colors.primary}20` }}
//                     >
//                       {/* Gradient overlay */}
//                       <div 
//                         className="absolute top-0 right-0 w-32 h-32 rounded-bl-full transition-opacity duration-300"
//                         style={{ background: `linear-gradient(135deg, ${colors.accent}10 0%, transparent 100%)` }}
//                       />

//                       {/* Header */}
//                       <div className="relative mb-6">
//                         <div className="flex items-start justify-between mb-4">
//                           <div 
//                             className="p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300"
//                             style={{ background: `${colors.primary}10` }}
//                           >
//                             <Icon className="w-7 h-7" style={{ color: colors.accent }} />
//                           </div>
//                           <div className="text-right">
//                             <div className="font-mono text-sm text-gray-400 mb-1">
//                               {term.number}
//                             </div>
//                             <div 
//                               className="px-3 py-1 rounded-full text-xs font-bold transition-colors duration-300"
//                               style={{ background: `${colors.primary}10`, color: colors.accent }}
//                             >
//                               {term.category}
//                             </div>
//                           </div>
//                         </div>

//                         <h3 className="text-2xl font-black mb-3 transition-colors duration-300" style={{ color: colors.primary }}>
//                           {term.title}
//                         </h3>

//                         <p className="text-gray-600 leading-relaxed text-sm mb-6 transition-colors duration-300">
//                           {term.text}
//                         </p>
//                       </div>

//                       {/* Key Points */}
//                       <div className="space-y-2 mb-6">
//                         {term.keyPoints?.slice(0, 3).map((point, idx) => (
//                           <motion.div
//                             key={idx}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.1 * idx + 0.2 }}
//                             className="flex items-center gap-2 text-sm"
//                           >
//                             <CheckCircle2 className="w-4 h-4 flex-shrink-0 transition-colors duration-300" style={{ color: colors.accent }} />
//                             <span className="text-gray-600 transition-colors duration-300">{point}</span>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             {/* Full Details Section - Expandable Panels */}
//             <div className="mt-24 max-w-5xl mx-auto space-y-6">
//               <motion.h2
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 viewport={{ once: true }}
//                 className="text-4xl font-black mb-12 text-center"
//                 style={{ color: colors.primary }}
//               >
//                 Complete Terms Documentation
//               </motion.h2>

//               {terms.map((term, index) => {
//                 const Icon = iconMap[term.icon] || FileText;
                
//                 return (
//                   <motion.details
//                     key={index}
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: index * 0.1 }}
//                     className="group bg-white border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:bg-gray-50 cursor-pointer"
//                     style={{ borderColor: `${colors.primary}20` }}
//                   >
//                     <summary className="cursor-pointer p-8 list-none flex items-center justify-between">
//                       <div className="flex items-center gap-6">
//                         <div 
//                           className="p-3 rounded-xl transition-colors duration-300"
//                           style={{ background: `${colors.primary}10` }}
//                         >
//                           <Icon className="w-6 h-6" style={{ color: colors.accent }} />
//                         </div>
//                         <div>
//                           <div className="flex items-center gap-3 mb-2">
//                             <span className="font-mono text-sm text-gray-400">{term.number}</span>
//                             <span 
//                               className="px-3 py-1 rounded-full text-xs font-bold transition-colors duration-300"
//                               style={{ background: `${colors.primary}10`, color: colors.accent }}
//                             >
//                               {term.category}
//                             </span>
//                           </div>
//                           <h3 className="text-2xl font-bold transition-colors duration-300" style={{ color: colors.primary }}>
//                             {term.title}
//                           </h3>
//                         </div>
//                       </div>
//                       <ChevronRight className="w-6 h-6 text-gray-400 group-open:rotate-90 transition-transform" />
//                     </summary>

//                     <div className="px-8 pb-8 pt-4 border-t transition-colors duration-300" style={{ borderColor: `${colors.primary}20` }}>
//                       <p className="text-gray-600 leading-relaxed mb-6 text-lg">
//                         {term.text}
//                       </p>

//                       {/* Key Points Expanded */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {term.keyPoints?.map((point, idx) => (
//                           <div key={idx} className="flex items-center gap-3 p-3 rounded-xl transition-colors duration-300" style={{ background: `${colors.primary}5` }}>
//                             <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: colors.accent }} />
//                             <span className="text-gray-700 text-sm">{point}</span>
//                           </div>
//                         ))}
                        
//                       </div>
//                     </div>
//                   </motion.details>
//                 );
//               })}
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }