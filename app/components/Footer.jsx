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
  FaShieldAlt
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
      address: "Mumbai, India",
      phone: "+91 98765 43210",
      email: "support@edpharma.com"
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
    { name: "LinkedIn", icon: <FaLinkedinIn />, color: "hover:bg-blue-700" },
    { name: "Facebook", icon: <FaFacebookF />, color: "hover:bg-blue-600" },
    { name: "Instagram", icon: <FaInstagram />, color: "hover:bg-pink-600" },
  ];

  const features = [
    { icon: <FaPills className="text-xl" />, text: "Quality Formulations" },
    { icon: <FaGlobeAmericas className="text-xl" />, text: "Global Distribution" },
    { icon: <FaShieldAlt className="text-xl" />, text: "Trust & Safety" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#0A2A73] to-[#051A4A] text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl"></div>
      <div className="absolute -left-20 bottom-0 w-64 h-64 rounded-full bg-cyan-900/10 blur-3xl"></div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        
        {/* Brand section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            
            <Link href="/" className="flex items-center">
            <img
              src="/logoed.svg"
              alt="ED Pharma"
              className="h-18 w-auto object-contain "
            />
          </Link>
            
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            {footerData.description}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-white/20">
            {footerData.headers.quickLinks}
          </h3>
          <ul className="space-y-3">
            {quickLinks.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-white/80 hover:text-cyan-300 transition-all duration-200 group"
                >
                  <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        {/* Categories */}
<div>
  <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-white/20">
    {footerData.headers.categories}
  </h3>
  <ul className="space-y-3">
    {categories.map((item) => {
      // Map category names to brand keys used in your products page
      const brandKey = {
        "Ajanta Pharma": "ED Ajanta Pharma",
        "Centurion Remedies": "ED Centurion Remedies",
        "Sunrise Remedies": "ED Sunrise Remedies"
      }[item];
      
      return (
        <li key={item}>
          <Link
            href={`/products?brand=${encodeURIComponent(brandKey)}`}
            className="flex items-center gap-2 text-white/80 hover:text-cyan-300 transition-all duration-200 group"
          >
            <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
            {item}
          </Link>
        </li>
      );
    })}
  </ul>
</div>

        {/* Contact */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-white/20">
              {footerData.headers.contact}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/80">
                <FaMapMarkerAlt className="text-cyan-300 flex-shrink-0" />
                <span>{footerData.contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <FaPhoneAlt className="text-cyan-300 flex-shrink-0" />
                <span>{footerData.contactInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <FaEnvelope className="text-cyan-300 flex-shrink-0" />
                <span>{footerData.contactInfo.email}</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-medium mb-3">{footerData.social?.followUs || "Follow Us"}</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`p-3 rounded-lg bg-white/10 hover:bg-white/20 ${social.color} transition-all duration-300 transform hover:-translate-y-1`}
                  aria-label={social.name}
                >
                  <div className="text-lg">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-white/10 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <p className="text-center text-white/70 text-sm">
            © {new Date().getFullYear()} ED Pharma — {footerData.copyright}.
          </p>
          <p className="text-center text-white/50 text-xs mt-2">
            {footerData.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}