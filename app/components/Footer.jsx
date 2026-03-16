"use client";

import Link from "next/link";
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope,
  FaArrowRight,
  FaChevronRight,
  FaUsers
} from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

export default function Footer() {
  const { t } = useLanguage();
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
      "Healing Pharma",
      "Hab Pharma"
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

  // Fetch real visitor count from API
  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/visitors');
        const data = await response.json();
        setVisitorCount(data.count);
      } catch (error) {
        console.error('Error fetching visitor count:', error);
        // Fallback to a default or cached value
        setVisitorCount(15234); // Example fallback
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorCount();
  }, []);

  const quickLinks = footerData.links;
  const categories = footerData.categories;

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
                src="/Ed_5.png"
                alt="ED Pharma"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {footerData.description}
          </p>
          
          {/* Visitor Counter - Live Version */}
          <div className="inline-block">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <FaUsers className="text-gray-500 text-xs" />
              <span className="text-xs text-gray-600">Visitors:</span>
              {loading ? (
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="text-sm font-semibold text-gray-800">
                  {visitorCount.toLocaleString()}
                </span>
              )}
            </div>
          </div>
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
                "Sunrise Remedies": "ED Sunrise Remedies",
                "Healing Pharma": "Healing Pharma",
                "Hab Pharma": "Hab Pharma",
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