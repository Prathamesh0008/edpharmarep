"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A2A73]" />

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold mb-4">ED Pharma</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Delivering trust, safety, and high-quality pharmaceutical
            formulations with global distribution capabilities.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-5">Quick Links</h3>
          <ul className="space-y-3 text-white/80 text-sm">
            {[
              { name: "Home", href: "/" },
              { name: "Products", href: "/products" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="hover:text-white transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="text-lg font-semibold mb-5">Categories</h3>
          <ul className="space-y-3 text-white/80 text-sm">
            {[
              "Ajanta Pharma",
              "Centurion Remedies",
              "Sunrise Remedies",
              "ED Solutions",
            ].map((item) => (
              <li key={item} className="hover:text-white transition">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-5">Contact</h3>
          <ul className="space-y-3 text-white/80 text-sm">
            <li>Mumbai, India</li>
            <li>+91 98765 43210</li>
            <li>support@edpharma.com</li>
          </ul>

          {/* SOCIAL */}
          <div className="flex gap-3 mt-6">
            {["LinkedIn", "Facebook", "Instagram"].map((item) => (
              <span
                key={item}
                className="px-3 py-2 text-xs rounded-full bg-white/15 hover:bg-white/25 transition cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="relative text-center py-5 border-t border-white/20 bg-black/20">
        <p className="text-white/70 text-xs">
          © {new Date().getFullYear()} ED Pharma — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}