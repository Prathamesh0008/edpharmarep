// app/terms/page.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ShieldCheck,
  FileText,
  Building2,
  Users,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Award,
  FileSignature,
  Download,
  Mail,
  Eye,
  ChevronRight,
  Info
} from "lucide-react";

export default function TermsPage() {
  const { t, language } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

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

  // Mouse move effect for gradient
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#063B8A] via-[#0a1628] to-[#063B8A]" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #4FB3E8 0%, transparent 70%)',
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #2A7DB8 0%, transparent 70%)',
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: 'radial-gradient(circle, #063B8A 0%, transparent 70%)',
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(#4FB3E8 1px, transparent 1px),
              linear-gradient(90deg, #4FB3E8 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10" ref={containerRef}>
        {/* Hero Section with Glassmorphism */}
        <section className="pt-32 pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
              >
                <Sparkles className="w-5 h-5 text-[#4FB3E8]" />
                <span className="text-sm font-bold text-white tracking-wide">LEGAL FRAMEWORK</span>
                <div className="px-3 py-1 bg-gradient-to-r from-[#063B8A] to-[#2A7DB8] rounded-full text-xs font-bold text-white">
                  {header.version}
                </div>
              </motion.div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#4FB3E8] to-white">
                  {header.title}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 mb-4 font-light max-w-3xl mx-auto">
                {header.subtitle}
              </p>

              <p className="text-sm text-blue-200/60 flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                {header.lastUpdated}
              </p>

              {/* Glass Card for Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 max-w-4xl mx-auto p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-300/20">
                    <AlertCircle className="w-6 h-6 text-red-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-white mb-2">
                      B2B Compliance & Verification Required
                    </h3>
                    <p className="text-blue-100/80 leading-relaxed">
                      {header.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats Bar - Glassmorphic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 max-w-5xl mx-auto "
            >
              {[
                { icon: FileText, label: "Sections", value: terms.length },
                { icon: ShieldCheck, label: "GDPR Compliant", value: "100%" },
                { icon: Building2, label: "B2B Only", value: "✓" },
                { icon: Award, label: "EU Certified", value: "✓" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl hover:bg-white/10 transition-all"
                >
                  <stat.icon className="w-8 h-9 text-[#4FB3E8] mb-3 mx-auto" />
                  <div className="text-2xl text-center font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-center text-white">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Terms Cards - Glassmorphic Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {terms.map((term, index) => {
                const Icon = iconMap[term.icon] || FileText;
                const isHovered = hoveredCard === index;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(null)}
                    whileHover={{ y: -8 }}
                    className="group relative"
                  >
                    {/* Glow effect on hover */}
                    {isHovered && (
                      <motion.div
                        layoutId="cardGlow"
                        className="absolute -inset-1 bg-gradient-to-r from-[#063B8A] via-[#2A7DB8] to-[#4FB3E8] rounded-3xl blur-xl opacity-50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Glass Card */}
                    <div className="relative h-full p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl hover:bg-white/10 transition-all overflow-hidden">
                      {/* Gradient overlay */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4FB3E8]/20 to-transparent rounded-bl-full" />

                      {/* Header */}
                      <div className="relative mb-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#063B8A]/40 to-[#2A7DB8]/40 backdrop-blur-sm border border-[#4FB3E8]/30 shadow-lg group-hover:scale-110 transition-transform">
                            <Icon className="w-7 h-7 text-[#4FB3E8]" />
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm text-blue-300/50 mb-1">
                              {term.number}
                            </div>
                            <div className="px-3 py-1 rounded-full bg-[#063B8A]/50 backdrop-blur-sm border border-[#4FB3E8]/30">
                              <span className="text-xs font-bold text-[#4FB3E8]">
                                {term.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#4FB3E8] transition-colors">
                          {term.title}
                        </h3>

                        <p className="text-blue-100/70 leading-relaxed text-sm mb-6">
                          {term.text}
                        </p>
                      </div>

                      {/* Key Points */}
                      <div className="space-y-2 mb-6">
                        {term.keyPoints?.slice(0, 3).map((point, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx + 0.2 }}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-blue-100/80">{point}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Read More Button */}
                      {/* <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#063B8A]/50 to-[#2A7DB8]/50 backdrop-blur-sm border border-[#4FB3E8]/30 text-white font-bold hover:from-[#063B8A] hover:to-[#2A7DB8] transition-all flex items-center justify-center gap-2 group">
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button> */}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Full Details Section - Expandable Glassmorphic Panels */}
            <div className="mt-24 max-w-5xl mx-auto space-y-6">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-4xl font-black text-white mb-12 text-center"
              >
                Complete Terms Documentation
              </motion.h2>

              {terms.map((term, index) => {
                const Icon = iconMap[term.icon] || FileText;
                
                return (
                  <motion.details
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl hover:bg-white/10 transition-all overflow-hidden"
                  >
                    <summary className="cursor-pointer p-8 list-none flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#063B8A]/40 to-[#2A7DB8]/40 backdrop-blur-sm border border-[#4FB3E8]/30">
                          <Icon className="w-6 h-6 text-[#4FB3E8]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-blue-300/50">{term.number}</span>
                            <span className="px-3 py-1 rounded-full bg-[#063B8A]/50 backdrop-blur-sm border border-[#4FB3E8]/30 text-xs font-bold text-[#4FB3E8]">
                              {term.category}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-[#4FB3E8] transition-colors">
                            {term.title}
                          </h3>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-blue-300 group-open:rotate-90 transition-transform" />
                    </summary>

                    <div className="px-8 pb-8 pt-4 border-t border-white/10">
                      <p className="text-blue-100/80 leading-relaxed mb-6 text-lg">
                        {term.text}
                      </p>

                     
                      
                    </div>
                  </motion.details>
                );
              })}
            </div>

            

            
          </div>
        </section>
      </div>
    </div>
  );
}