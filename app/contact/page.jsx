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
  const [sentTo, setSentTo] = useState(""); // ✅ to show email after form resets
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
        icon: "📞",
        title: "(+91)-9525446820",
        description: "Call us for any questions or support",
      },
      {
        icon: "✉️",
        title: "info.edpharmacy@gmail.com",
        description: "Email us for business inquiries",
      },
      {
        icon: "📍",
        title: "London Eye London",
        description: "Our main office location",
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
        email: "Enter your email address",
        phone: "Enter your phone number",
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
      },
      phone: {
        required: "Phone is required",
        invalid: "Phone number is invalid",
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
    // ✅ if user starts typing again, hide success
    if (submitted) setSubmitted(false);

    setForm({ ...form, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: null }));
    }
  };

  const validate = () => {
    let newErrors = {};

    // Email
    if (!form.email?.trim()) {
      newErrors.email = validation.email?.required || "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      newErrors.email = validation.email?.invalid || "Email is invalid";
    }

    // Phone (simple, reliable)
    const digits = (form.phone || "").replace(/\D/g, "");
    if (!digits) {
      newErrors.phone = validation.phone?.required || "Phone is required";
    } else if (digits.length < 7) {
      newErrors.phone =
        validation.phone?.invalid || "Phone number is invalid";
    }

    // Name
    if (!form.name?.trim()) {
      newErrors.name = validation.name?.required || "Name is required";
    }

    // Message
    if (!form.message?.trim()) {
      newErrors.message =
        validation.message?.required || "Message is required";
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
      // ✅ env check
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const TEMPLATE_ADMIN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN;
      const TEMPLATE_USER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_USER;
      const ADMIN_EMAIL =
        process.env.NEXT_PUBLIC_ADMIN_EMAIL || "biopeptide07@gmail.com";

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

      // ✅ send admin + user
      const [adminRes, userRes] = await Promise.all([
        emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, payloadAdmin, PUBLIC_KEY),
        emailjs.send(SERVICE_ID, TEMPLATE_USER, payloadUser, PUBLIC_KEY),
      ]);

      // If EmailJS returns an error, it will throw (catch below)

      setSentTo(form.email.trim());
      setSubmitted(true);

      // Reset form
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-[#0c2d3e]">
      {/* <Navbar/> */}

      {/* HERO */}
      <section className="text-center px-4 py-20 bg-gradient-to-r from-blue-900 to-cyan-600">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {hero.title || "Contact Us"}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            {hero.subtitle || "Get in touch with us for any inquiries or support"}
          </p>
          <div className="mt-8 w-20 h-1 bg-white/40 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* 2-Column Layout */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 mb-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* LEFT SIDE - INFO CARDS */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  Get in Touch
                </h2>
                <p className="text-blue-700">
                  We're here to help and answer any questions you might have.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.length > 0 ? (
                  contactInfo.map((item, i) => (
                    <div
                      key={i}
                      className="group bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl">
                          {item.icon || "📞"}
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 text-lg">
                            {item.title || "Contact Info"}
                          </h4>
                          <p className="text-blue-600 mt-1">
                            {item.description || "Contact description"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="group bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl">
                          📞
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 text-lg">
                            (+91)-9525446820
                          </h4>
                          <p className="text-blue-600 mt-1">
                            Call us for any questions or support
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="group bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl">
                          ✉️
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 text-lg">
                            info.edpharmacy@gmail.com
                          </h4>
                          <p className="text-blue-600 mt-1">
                            Email us for business inquiries
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="group bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl">
                          📍
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 text-lg">
                            London Eye London
                          </h4>
                          <p className="text-blue-600 mt-1">
                            Our main office location
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Map/Additional Info */}
              <div className="mt-10 pt-8 border-t border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Working Hours
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-blue-700 mt-1">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-blue-700 mt-1">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - CONTACT FORM */}
            <div className="bg-gradient-to-b from-white to-blue-50 p-6 rounded-xl border border-blue-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  Send us a Message
                </h2>
                <p className="text-blue-700">
                  Fill out the form below and we'll get back to you shortly.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className={`space-y-6 ${shake ? "animate-shake" : ""}`}
                noValidate
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">
                      {formLabels.email || "Email *"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? "input-error" : ""}`}
                      aria-invalid={errors.email ? "true" : "false"}
                      placeholder={formPlaceholders.email || "Enter your email address"}
                      disabled={isLoading}
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="form-label">
                      {formLabels.phone || "Phone *"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? "input-error" : ""}`}
                      aria-invalid={errors.phone ? "true" : "false"}
                      placeholder={formPlaceholders.phone || "Enter your phone number"}
                      disabled={isLoading}
                    />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="form-label">{formLabels.name || "Name *"}</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? "input-error" : ""}`}
                    aria-invalid={errors.name ? "true" : "false"}
                    placeholder={formPlaceholders.name || "Enter your full name"}
                    disabled={isLoading}
                  />
                  {errors.name && <p className="error-text">{errors.name}</p>}
                </div>

                <div>
                  <label className="form-label">
                    {formLabels.message || "Message *"}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={`form-input h-32 resize-none ${errors.message ? "input-error" : ""}`}
                    aria-invalid={errors.message ? "true" : "false"}
                    placeholder={formPlaceholders.message || "Type your message here..."}
                    disabled={isLoading}
                    rows={5}
                  />
                  {errors.message && <p className="error-text">{errors.message}</p>}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="error-text text-center">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn-primary group w-full ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                          className="w-5 h-5 transition-transform group-hover:translate-x-1"
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
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
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
                      <div>
                        <p className="text-green-800 font-medium">
                          {formButtons.successMessage ||
                            "✅ Message sent successfully! Check your email for confirmation."}
                        </p>
                        <p className="text-green-700 text-sm mt-1">
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

      {/* INLINE STYLES */}
      <style jsx>{`
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: #1e3a8a;
        }
        .form-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 10px;
          border: 2px solid #dbeafe;
          background: white;
          color: #1e3a8a;
          font-size: 15px;
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
          font-size: 13px;
          margin-top: 4px;
          font-weight: 500;
        }
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          padding: 16px 24px;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          outline: none;
          font-size: 16px;
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
            transform: translateX(-6px);
          }
          40%,
          80% {
            transform: translateX(6px);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
      `}</style>
    </main>
  );
}