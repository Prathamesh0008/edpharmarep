// app/contact/page.jsx
"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t, language } = useLanguage();

  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get translations from context
  const contactTranslations = t?.contactPage || {
    hero: {
      title: "Contact Us",
      subtitle: "Get in touch with us for any inquiries or support",
    },
    contactInfo: [
      {
        icon: "✉️",
        title: "sales@edpharma.co",
        description: "Email us for business inquiries",
      },
    ],
    form: {
      labels: {
        email: "Email *",
        phone: "Phone *",
        name: "Name *",
        message: "Message *",
      },
      placeholders: {
        email: "Enter your email address (must be @gmail.com)",
        phone: "Enter 10-digit phone number",
        name: "Enter your full name",
        message: "Type your message here...",
      },
      submitButton: "Submit Message",
      submittingButton: "Sending...",
      successMessage: "✅ Message sent successfully! Check your email for confirmation.",
    },
    validation: {
      email: {
        required: "Email is required",
        invalid: "Email is invalid",
        gmailRequired: "Only Gmail addresses (@gmail.com) are accepted",
      },
      phone: {
        required: "Phone number is required",
        invalid: "Phone number must be exactly 10 digits",
        onlyDigits: "Phone number should contain only digits",
      },
      name: {
        required: "Name is required",
      },
      message: {
        required: "Message is required",
      },
    },
  };

  const hero = contactTranslations?.hero || {};
  const contactInfo = contactTranslations?.contactInfo || [];
  const formLabels = contactTranslations?.form?.labels || {};
  const formPlaceholders = contactTranslations?.form?.placeholders || {};
  const formButtons = contactTranslations?.form || {};
  const validation = contactTranslations?.validation || {};

  const handleChange = (e) => {
    if (submitted) setSubmitted(false);

    const { name, value } = e.target;
    
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setForm({ ...form, [name]: digitsOnly.slice(0, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: null }));
    }
  };

  const validate = () => {
    let newErrors = {};

    // Email validation - must be @gmail.com
    if (!form.email?.trim()) {
      newErrors.email = validation.email?.required || "Email is required";
    } else {
      const email = form.email.trim().toLowerCase();
      if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = validation.email?.invalid || "Email is invalid";
      }
      else if (!email.endsWith("@gmail.com")) {
        newErrors.email = validation.email?.gmailRequired || "Only Gmail addresses (@gmail.com) are accepted";
      }
    }

    // Phone validation - exactly 10 digits
    const digits = form.phone || "";
    if (!digits) {
      newErrors.phone = validation.phone?.required || "Phone number is required";
    } else if (!/^\d+$/.test(digits)) {
      newErrors.phone = validation.phone?.onlyDigits || "Phone number should contain only digits";
    } else if (digits.length !== 10) {
      newErrors.phone = validation.phone?.invalid || "Phone number must be exactly 10 digits";
    }

    // Name validation
    if (!form.name?.trim()) {
      newErrors.name = validation.name?.required || "Name is required";
    }

    // Message validation
    if (!form.message?.trim()) {
      newErrors.message = validation.message?.required || "Message is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSubmitted(false);

    try {
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const TEMPLATE_ADMIN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN;
      const TEMPLATE_USER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_USER;
      const ADMIN_EMAIL =
        process.env.NEXT_PUBLIC_ADMIN_EMAIL || "sales@edpharma.co";

      if (!SERVICE_ID || !PUBLIC_KEY || !TEMPLATE_ADMIN || !TEMPLATE_USER) {
        throw new Error(
          "Email service not configured. Please check EmailJS env variables."
        );
      }

      const reference = `CONT-${Date.now().toString().slice(-6)}`;
      const submittedAt = new Date().toLocaleString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const payloadAdmin = {
        to_email: ADMIN_EMAIL,
        from_name: form.name.trim(),
        from_email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        reference,
        date: submittedAt,
      };

      const payloadUser = {
        to_email: form.email.trim(),
        to_name: form.name.trim(),
        from_name: "ED Pharma",
        phone: form.phone.trim(),
        message: form.message.trim(),
        reference,
        date: submittedAt,
      };

      await Promise.all([
        emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, payloadAdmin, PUBLIC_KEY),
        emailjs.send(SERVICE_ID, TEMPLATE_USER, payloadUser, PUBLIC_KEY),
      ]);

      setSentTo(form.email.trim());
      setSubmitted(true);

      setForm({
        email: "",
        phone: "",
        name: "",
        message: "",
      });
    } catch (error) {
      console.error("❌ EmailJS error:", error);
      setErrors({
        submit:
          error?.text ||
          error?.message ||
          "Failed to send message. Please try again.",
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-[#0c2d3e] overflow-x-hidden">
      {/* <Navbar/> */}

      {/* HERO - Responsive padding and text sizes */}
      <section className="text-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-900 to-cyan-600">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
            {hero.title || "Contact Us"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto px-2 sm:px-4">
            {hero.subtitle || "Get in touch with us for any inquiries or support"}
          </p>
          <div className="mt-6 sm:mt-8 w-16 sm:w-20 h-1 bg-white/40 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Main Content - Responsive margins and padding */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 -mt-6 sm:-mt-8 md:-mt-10 mb-12 sm:mb-16 md:mb-20">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
            
            {/* LEFT SIDE - INFO CARDS */}
            <div className="order-2 md:order-1">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-1 sm:mb-2">
                  Get in Touch
                </h2>
                <p className="text-sm sm:text-base text-blue-700">
                  We're here to help and answer any questions you might have.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {contactInfo.length > 0 ? (
                  contactInfo.map((item, i) => (
                    <div
                      key={i}
                      className="group bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                          {item.icon || "📞"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-blue-900 text-sm sm:text-base md:text-lg break-words">
                            {item.title || "Contact Info"}
                          </h4>
                          <p className="text-blue-600 mt-1 text-xs sm:text-sm break-words">
                            {item.description || "Contact description"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="group bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                          📞
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-blue-900 text-sm sm:text-base md:text-lg break-words">
                            +91 9892899094
                          </h4>
                          <p className="text-blue-600 mt-1 text-xs sm:text-sm break-words">
                            Call us for any questions or support
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="group bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0">
                          ✉️
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-blue-900 text-sm sm:text-base md:text-lg break-words">
                            sales@edpharma.co
                          </h4>
                          <p className="text-blue-600 mt-1 text-xs sm:text-sm break-words">
                            Email us for business inquiries
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - CONTACT FORM */}
            <div className="bg-gradient-to-b from-white to-blue-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-blue-100 order-1 md:order-2">
              <div className="mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-1 sm:mb-2">
                  Send us a Message
                </h2>
                <p className="text-sm sm:text-base text-blue-700">
                  Fill out the form below and we'll get back to you shortly.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className={`space-y-4 sm:space-y-5 md:space-y-6 ${shake ? "animate-shake" : ""}`}
                noValidate
              >
                {/* Responsive grid - stack on mobile, side by side on tablet+ */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-4">
                  <div>
                    <label className="form-label text-xs sm:text-sm">
                      {formLabels.email || "Email *"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`form-input text-sm sm:text-base p-2.5 sm:p-3 md:p-4 ${errors.email ? "input-error" : ""}`}
                      aria-invalid={errors.email ? "true" : "false"}
                      placeholder={formPlaceholders.email || "Enter your email address (must be @gmail.com)"}
                      disabled={isLoading}
                    />
                    {errors.email && <p className="error-text text-xs sm:text-sm">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="form-label text-xs sm:text-sm">
                      {formLabels.phone || "Phone *"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className={`form-input text-sm sm:text-base p-2.5 sm:p-3 md:p-4 ${errors.phone ? "input-error" : ""}`}
                      aria-invalid={errors.phone ? "true" : "false"}
                      placeholder={formPlaceholders.phone || "Enter 10-digit phone number"}
                      disabled={isLoading}
                      maxLength="10"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    {errors.phone && <p className="error-text text-xs sm:text-sm">{errors.phone}</p>}
                    {form.phone && form.phone.length > 0 && form.phone.length < 10 && (
                      <p className="text-xs text-amber-600 mt-1">
                        {10 - form.phone.length} more digit{10 - form.phone.length !== 1 ? 's' : ''} required
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label text-xs sm:text-sm">{formLabels.name || "Name *"}</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`form-input text-sm sm:text-base p-2.5 sm:p-3 md:p-4 ${errors.name ? "input-error" : ""}`}
                    aria-invalid={errors.name ? "true" : "false"}
                    placeholder={formPlaceholders.name || "Enter your full name"}
                    disabled={isLoading}
                  />
                  {errors.name && <p className="error-text text-xs sm:text-sm">{errors.name}</p>}
                </div>

                <div>
                  <label className="form-label text-xs sm:text-sm">
                    {formLabels.message || "Message *"}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={`form-input h-24 sm:h-28 md:h-32 resize-none text-sm sm:text-base p-2.5 sm:p-3 md:p-4 ${errors.message ? "input-error" : ""}`}
                    aria-invalid={errors.message ? "true" : "false"}
                    placeholder={formPlaceholders.message || "Type your message here..."}
                    disabled={isLoading}
                    rows={4}
                  />
                  {errors.message && <p className="error-text text-xs sm:text-sm">{errors.message}</p>}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                    <p className="error-text text-center text-xs sm:text-sm">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn-primary group w-full text-sm sm:text-base p-3 sm:p-4 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {formButtons.submittingButton || "Sending..."}
                      </>
                    ) : (
                      <>
                        <span>{formButtons.submitButton || "Submit Message"}</span>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                {submitted && (
                  <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-green-800 font-medium text-xs sm:text-sm break-words">
                          {formButtons.successMessage ||
                            "✅ Message sent successfully! Check your email for confirmation."}
                        </p>
                        <p className="text-green-700 text-xs mt-1 break-words">
                          We've sent a confirmation email to{" "}
                          <span className="font-semibold">{sentTo}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer/> */}

      {/* RESPONSIVE STYLES */}
      <style jsx>{`
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.375rem;
          color: #1e3a8a;
        }
        
        @media (max-width: 640px) {
          .form-label {
            font-size: 0.75rem;
            margin-bottom: 0.25rem;
          }
        }
        
        .form-input {
          width: 100%;
          border-radius: 0.625rem;
          border: 2px solid #dbeafe;
          background: white;
          color: #1e3a8a;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: #f8fafc;
        }
        
        .form-input:disabled {
          background-color: #f1f5f9;
          cursor: not-allowed;
          border-color: #cbd5e1;
        }
        
        .form-input::placeholder {
          color: #94a3b8;
        }
        
        .input-error {
          border-color: #ef4444 !important;
          background: #fef2f2;
        }
        
        .input-error:focus {
          border-color: #dc2626 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .error-text {
          color: #dc2626;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          font-weight: 500;
        }
        
        @media (min-width: 640px) {
          .error-text {
            font-size: 0.875rem;
          }
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          border-radius: 0.625rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          outline: none;
          position: relative;
          overflow: hidden;
        }
        
        .btn-primary:before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: 0.5s;
        }
        
        .btn-primary:hover:not(:disabled):before {
          left: 100%;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }
        
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-4px);
          }
          40%,
          80% {
            transform: translateX(4px);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-shake {
          animation: shake 0.3s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        /* Prevent horizontal scroll on mobile */
        @media (max-width: 640px) {
          main {
            overflow-x: hidden;
          }
          
          .break-words {
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
          }
        }
      `}</style>
    </main>
  );
}