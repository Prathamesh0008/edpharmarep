"use client";

import Link from "next/link";
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaPills,
  FaGlobeAmericas,
  FaShieldAlt,
  FaArrowRight,
  FaChevronRight
} from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  // Get footer translations or use defaults
  const footerData = t?.footer || {
    description: "Delivering trust, safety, and high-quality pharmaceutical formulations with global distribution capabilities.",
    headers: {
      quickLinks: "Quick Links",
      categories: "Categories",
      contact: "Contact"
    },
    links: [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" }
    ],
    categories: [
      "Ajanta Pharma",
      "Centurion Remedies",
      "Sunrise Remedies",
    ],
    contactInfo: {
      address: "Europe",
      phone: "+91 98765 43210",
      email: "info.edpharmacy@gmail.com"
    },
    social: {
      followUs: "Follow Us"
    },
    copyright: "All Rights Reserved",
    tagline: "Pharmaceuticals • Quality • Trust"
  };

  const quickLinks = footerData.links;
  const categories = footerData.categories;

  const socialLinks = [
    { name: "LinkedIn", icon: <FaLinkedinIn />, color: "hover:bg-blue-700", bg: "bg-blue-600" },
    { name: "Facebook", icon: <FaFacebookF />, color: "hover:bg-blue-600", bg: "bg-blue-500" },
    { name: "Instagram", icon: <FaInstagram />, color: "hover:bg-pink-600", bg: "bg-pink-500" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] text-gray-800 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>
      
      {/* Background decorative elements */}
      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-100 blur-3xl"></div>
      <div className="absolute -left-20 bottom-0 w-64 h-64 rounded-full bg-cyan-100 blur-3xl"></div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        
        {/* Brand section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <img
                src="/logoed.svg"
                alt="ED Pharma"
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {footerData.description}
          </p>
          
          
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800 flex items-center gap-2">
            <FaChevronRight className="text-blue-500 text-sm" />
            {footerData.headers.quickLinks}
          </h3>
          <ul className="space-y-3">
            {quickLinks.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200 group"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
                  <FaArrowRight className="text-xs text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800 flex items-center gap-2">
            <FaChevronRight className="text-blue-500 text-sm" />
            {footerData.headers.categories}
          </h3>
          <ul className="space-y-3">
            {categories.map((item) => {
              const brandKey = {
                "Ajanta Pharma": "ED Ajanta Pharma",
                "Centurion Remedies": "ED Centurion Remedies",
                "Sunrise Remedies": "ED Sunrise Remedies"
              }[item];
              
              return (
                <li key={item}>
                  <Link
                    href={`/products?brand=${encodeURIComponent(brandKey)}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200 group"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
                    <FaArrowRight className="text-xs text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" />
                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800 flex items-center gap-2">
              <FaChevronRight className="text-blue-500 text-sm" />
              {footerData.headers.contact}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 group">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FaMapMarkerAlt className="text-blue-500" />
                </div>
                <span className="pt-1">{footerData.contactInfo.address}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600 group">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FaPhoneAlt className="text-blue-500" />
                </div>
                <span className="pt-1">{footerData.contactInfo.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600 group">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FaEnvelope className="text-blue-500" />
                </div>
                <span className="pt-1">{footerData.contactInfo.email}</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} ED Pharma — {footerData.copyright}.
          </p>
          <p className="text-center text-gray-400 text-xs mt-2">
            {footerData.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}