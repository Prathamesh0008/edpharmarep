// app/about/page.jsx
"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollProgressLine from "../components/ScrollProgressLine";
import Offer from "../components/Offer";
import { useLanguage } from "@/context/LanguageContext";
import { 
  ShieldCheck, 
  Globe,  // Changed from GlobeEurope
  Building, 
  Truck, 
  FileText,
  ChevronRight,
  Award,
  Users,
  Package,
  Target,
  HeartPulse,
  CheckCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AboutPage() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef([]);

  // Get translations from context, fallback to English structure
  const aboutTranslations = t?.about || {
    hero: {
      tag: "ABOUT US",
      title: "Discover ED_pharma – Protecting Intimate Health With Expertise And Care",
      description1: "ED_pharma is a specialised Europe-to-Europe distributor focused on high-quality erectile-dysfunction and sexual-health medicines from trusted manufacturers such as Ajanta Pharma, Sunrise Remedies and Centurion.",
      description2: "Our portfolio covers solid and oral-jelly formulations built around well-known active ingredients including Sildenafil, Tadalafil, Avanafil, Vardenafil and Dapoxetine, allowing partners to serve a broad spectrum of ED and premature-ejaculation treatment needs while maintaining strong safety and efficacy standards.",
      description3: 'Operating under the motto "Europe to Europe", we combine rigorous quality assurance with efficient logistics, helping wholesalers, pharmacies and online platforms access consistent supply from established Indian manufacturers while respecting local regulatory expectations.',
      downloadCatalogue: "Download catalogue",
      stats: [
        { value: "500+", label: "Partner Pharmacies" },
        { value: "99.7%", label: "Supply Reliability" },
        { value: "24h", label: "Support Response" },
        { value: "15+", label: "European Countries" }
      ]
    },
    card: {
      tag: "EUROPE TO EUROPE",
      titleLeft: "ED",
      titleRight: "PHARMA",
      description: "Master product catalogue and distribution partner for advanced erectile-dysfunction therapies across Europe.",
      features: [
        {
          title: "Focused portfolio",
          text: "Dedicated to ED and sexual-health therapies rather than broad generic ranges."
        },
        {
          title: "Quality assurance",
          text: "Products sourced from GMP-compliant manufacturers with proven international presence."
        },
        {
          title: "Flexible formats",
          text: "Tablets, jellies, chewables and other patient-friendly dosage forms."
        },
        {
          title: "Partner support",
          text: "Guidance for distributors and pharmacies on portfolio selection and catalogue planning."
        }
      ]
    },
    journey: {
      tag: "OUR JOURNEY",
      title: "Building a dedicated ED supply network across Europe",
      description1: "ED_pharma was founded to bridge European demand for reliable erectile-dysfunction therapies with high-performing Indian manufacturers. By focusing exclusively on ED and related indications, we can curate a portfolio that supports wholesalers, pharmacies and digital clinics with depth instead of volume.",
      description2: "Long-term relationships with suppliers and customers help us maintain continuity of supply, transparent communication and clear expectations on quality, packaging and documentation.",
      readMore: "Read more",
      milestones: [
        { year: "2018", title: "Foundation", description: "Established with focus on European ED market" },
        { year: "2020", title: "Expansion", description: "Partnership with top Indian manufacturers" },
        { year: "2022", title: "Growth", description: "Coverage across 15+ European countries" },
        { year: "2024", title: "Innovation", description: "Digital platform & enhanced logistics" }
      ]
    },
    howWeWork: {
      tag: "HOW WE WORK",
      title: "Europe-to-Europe service with quality at the core",
      description1: "From forecast to final shipment, every ED_pharma order is managed with clear batch traceability, temperature-appropriate logistics and documentation aligned to European expectations.",
      description2: "The goal is to give partners a single, specialised point of contact for ED medicines—simplifying sourcing while protecting patient safety and product integrity across the supply chain.",
      readMore: "Read more",
      process: [
        { step: "1", title: "Quality Sourcing", description: "GMP-certified manufacturers only" },
        { step: "2", title: "Rigorous Testing", description: "Comprehensive quality control" },
        { step: "3", title: "Secure Logistics", description: "Temperature-controlled shipping" },
        { step: "4", title: "Partner Support", description: "Dedicated account management" }
      ]
    },
    focus: {
      tag: "OUR FOCUS",
      title: "Protecting Sexual Health Across Europe",
      items: [
        {
          title: "Specialised ED Range",
          text: "Narrow therapeutic focus on erectile-dysfunction and related sexual-health indications, enabling deep product knowledge and consistent portfolio development."
        },
        {
          title: "Trusted Manufacturers",
          text: "Collaboration with established Indian manufacturers whose ED brands are recognised in international markets."
        },
        {
          title: "European Distribution",
          text: "Europe-to-Europe logistics for reliable supply, responsive lead times and discrete order handling."
        }
      ]
    }
  };

  const hero = aboutTranslations?.hero || {};
  const card = aboutTranslations?.card || {};
  const journey = aboutTranslations?.journey || {};
  const howWeWork = aboutTranslations?.howWeWork || {};
  const focus = aboutTranslations?.focus || {};

  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-25 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-sky-100 to-cyan-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-gradient-to-t from-transparent via-blue-50/20 to-transparent"></div>
      </div>
      
      <ScrollProgressLine />
      <Offer />
      
      {/* Hero Section with Floating Elements */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-20">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float-slow">
          <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full opacity-20 blur-sm"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-15 blur-sm"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-xs font-semibold text-white tracking-widest">
                {hero.tag || "ABOUT US"}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-sky-800 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
                {hero.title?.split("–")[0] || "Discover ED_pharma"}
              </span>
              <span className="block text-slate-800 mt-2">
                {hero.title?.split("–")[1] || "Protecting Intimate Health With Expertise And Care"}
              </span>
            </h1>
            
            <div className="space-y-4 text-slate-600">
              <p className="text-lg leading-relaxed">
                {hero.description1}
              </p>
              <p className="text-lg leading-relaxed">
                {hero.description2}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-full hover:from-sky-700 hover:to-cyan-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <FileText className="w-4 h-4 mr-2" />
                {hero.downloadCatalogue || "Download catalogue"}
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-sky-600 border-2 border-sky-200 rounded-full hover:bg-sky-50 hover:border-sky-300 transition-all duration-300"
              >
                Contact Sales
              </Link>
            </div>
          </div>
          
          {/* Right Stats Grid */}
          <div className={`grid grid-cols-2 gap-6 transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}>
            {/* Main Feature Card */}
            <div className="col-span-2 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-cyan-500 rounded-3xl blur opacity-30"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-sky-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-2xl">
                    <Globe className="w-6 h-6 text-white" /> {/* Changed from GlobeEurope */}
                  </div>
                  <div>
                    <span className="text-xs font-semibold tracking-widest text-sky-500">
                      {card.tag || "EUROPE TO EUROPE"}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">
                      <span className="text-sky-700">{card.titleLeft || "ED"}</span>
                      <span className="text-cyan-500">{card.titleRight || "PHARMA"}</span>
                    </h2>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-8">
                  {card.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {card.features && card.features.map((feature, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-slate-900">{feature.title}</span>
                      </div>
                      <p className="text-xs text-slate-500">{feature.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            {hero.stats && hero.stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-sky-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* Journey Timeline */}
{/* Journey Timeline */}
<section 
  ref={el => sectionRefs.current[0] = el}
  className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
>
  <div className="bg-gradient-to-br from-white via-sky-50 to-cyan-50 rounded-4xl p-8 lg:p-12 border border-sky-100 shadow-2xl">
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full mb-4">
        <Target className="w-3 h-3 text-white" />
        <span className="text-xs font-semibold text-white tracking-widest">
          {journey.tag || "OUR JOURNEY"}
        </span>
      </div>
      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
        {journey.title || "Building a dedicated ED supply network across Europe"}
      </h2>
      <p className="text-lg text-slate-600 max-w-3xl mx-auto">
        {journey.description1}
      </p>
    </div>
    
    {/* Timeline */}
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-sky-400 via-cyan-400 to-blue-400"></div>
      
      <div className="space-y-12">
        {journey.milestones && journey.milestones.map((milestone, index) => (
          <div 
            key={index}
            className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            {/* Timeline Node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-6 h-6 rounded-full bg-white border-4 border-sky-500 shadow-lg"></div>
            </div>
            
            {/* Content Card */}
            <div className={`w-5/12 ${index % 2 === 0 ? 'pr-16' : 'pl-16'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-xl">
                    <span className="text-white font-bold">{milestone.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{milestone.title}</h3>
                </div>
                <p className="text-slate-600">{milestone.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Add the Read More button here */}
    <div className="mt-16 text-center">
      <p className="text-slate-600 mb-8 max-w-3xl mx-auto">
        {journey.description2 || "Long-term relationships with suppliers and customers help us maintain continuity of supply, transparent communication and clear expectations on quality, packaging and documentation."}
      </p>
      
      <Link
        href="/about/journey"
        className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-full hover:from-sky-700 hover:to-cyan-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        {journey.readMore || "Read more"}
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
</section>

      {/* How We Work Process */}
      <section 
        ref={el => sectionRefs.current[1] = el}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="bg-gradient-to-br from-sky-50 via-white to-cyan-50 rounded-4xl p-8 lg:p-12 border border-sky-100 shadow-2xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full mb-4">
              <Building className="w-3 h-3 text-white" />
              <span className="text-xs font-semibold text-white tracking-widest">
                {howWeWork.tag || "HOW WE WORK"}
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              {howWeWork.title || "Europe-to-Europe service with quality at the core"}
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              {howWeWork.description1}
            </p>
          </div>
          
          {/* Process Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howWeWork.process && howWeWork.process.map((step, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-6 border border-sky-100 hover:border-sky-200 transition-all duration-300 group-hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
                      {step.step}
                    </div>
                    <div className="p-3 bg-gradient-to-r from-sky-100 to-cyan-100 rounded-xl">
                      {index === 0 && <Package className="w-6 h-6 text-sky-600" />}
                      {index === 1 && <ShieldCheck className="w-6 h-6 text-sky-600" />}
                      {index === 2 && <Truck className="w-6 h-6 text-sky-600" />}
                      {index === 3 && <Users className="w-6 h-6 text-sky-600" />}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/about/how-we-work"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 rounded-full hover:from-sky-700 hover:to-cyan-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {howWeWork.readMore || "Read more"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section 
        ref={el => sectionRefs.current[2] = el}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full mb-4">
            <HeartPulse className="w-3 h-3 text-white" />
            <span className="text-xs font-semibold text-white tracking-widest">
              {focus.tag || "OUR FOCUS"}
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
            {focus.title || "Protecting Sexual Health Across Europe"}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {focus.items && focus.items.map((item, index) => (
            <div 
              key={index} 
              className="group relative"
            >
              {/* Background Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Card Content */}
              <div className="relative bg-gradient-to-b from-white to-blue-50 rounded-2xl p-8 border border-sky-100 hover:border-sky-200 transition-all duration-500 group-hover:-translate-y-2">
                {/* Icon Background */}
                <div className="mb-6">
                  <div className="inline-flex p-4 bg-gradient-to-r from-sky-100 to-cyan-100 rounded-2xl">
                    {index === 0 && <Package className="w-8 h-8 text-sky-600" />}
                    {index === 1 && <Building className="w-8 h-8 text-sky-600" />}
                    {index === 2 && <Globe className="w-8 h-8 text-sky-600" />} {/* Changed from GlobeEurope */}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.text}
                </p>
                
                {/* Bottom Accent */}
                <div className="mt-8 pt-6 border-t border-sky-100 group-hover:border-sky-200 transition-colors">
                  <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-4xl">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-500 opacity-90"></div>
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
               }}>
          </div>
          
          {/* Content */}
          
        </div>
      </section>

      {/* Add these styles to your global CSS or use a style tag */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}