"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function AuthForm1() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🔒 keep your existing logic here (unchanged)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      <Navbar />

      {/* PAGE WRAPPER */}
      <div className="pt-36 px-4 flex justify-center">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-10 items-start">
          {/* LEFT — BRAND INTRO (LIKE ABOUT PAGE) */}
          <div className="hidden md:block min-h-[360px]">
            <p className="text-xs font-semibold tracking-[0.35em] text-sky-500">
              EUROPE TO EUROPE
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight bg-gradient-to-r from-sky-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
              Welcome to ED Pharma
            </h1>

            <p className="mt-6 text-sm text-slate-700 leading-relaxed max-w-md">
              Access a focused Europe-to-Europe pharmaceutical platform
              dedicated to erectile-dysfunction and sexual-health therapies.
            </p>

            <p className="mt-3 text-sm text-slate-700 leading-relaxed max-w-md">
              Secure partner access for distributors, pharmacies, and digital
              healthcare platforms.
            </p>
          </div>

          {/* RIGHT — GLASS AUTH CARD */}
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_30px_90px_rgba(15,23,42,0.25)] p-8 min-h-[420px]">
            {/* TOGGLE */}
            <div className="flex justify-center gap-10 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`text-sm font-semibold tracking-wide ${
                  isLogin
                    ? "text-sky-700 border-b-2 border-sky-600"
                    : "text-slate-500 hover:text-sky-600"
                }`}
              >
                LOGIN
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`text-sm font-semibold tracking-wide ${
                  !isLogin
                    ? "text-sky-700 border-b-2 border-sky-600"
                    : "text-slate-500 hover:text-sky-600"
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />

              {!isLogin && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              )}

              <button
                type="submit"
                className="w-full mt-4 rounded-full bg-[#063B8A] hover:bg-[#052F6B] text-white py-3 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                {isLogin ? "Login" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}