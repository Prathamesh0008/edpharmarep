// app/contact/page.jsx
"use client";

import { useState } from "react";
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
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get translations from context
  const contactTranslations = t?.contactPage || {
    hero: {
      title: "Contact Us",
      subtitle: "Get in touch with us for any inquiries or support"
    },
    contactInfo: [
      { 
        icon: "📞", 
        title: "(+91)-9525446820", 
        description: "Call us for any questions or support" 
      },
      { 
        icon: "✉️", 
        title: "mail@influenca.id", 
        description: "Email us for business inquiries" 
      },
      { 
        icon: "📍", 
        title: "London Eye London", 
        description: "Our main office location" 
      },
    ],
    form: {
      labels: {
        email: "Email *",
        phone: "Phone *",
        name: "Name *",
        message: "Message *"
      },
      placeholders: {
        email: "Enter your email address",
        phone: "Enter your phone number",
        name: "Enter your full name",
        message: "Type your message here..."
      },
      submitButton: "Submit Message",
      submittingButton: "Sending...",
      successMessage: "✅ Message sent successfully! Check your email for confirmation."
    },
    validation: {
      email: {
        required: "Email is required",
        invalid: "Email is invalid"
      },
      phone: {
        required: "Phone is required",
        invalid: "Phone number is invalid"
      },
      name: {
        required: "Name is required"
      },
      message: {
        required: "Message is required"
      }
    }
  };

  const hero = contactTranslations?.hero || {};
  const contactInfo = contactTranslations?.contactInfo || [];
  const formLabels = contactTranslations?.form?.labels || {};
  const formPlaceholders = contactTranslations?.form?.placeholders || {};
  const formButtons = contactTranslations?.form || {};
  const validation = contactTranslations?.validation || {};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!form.email) newErrors.email = validation.email?.required || "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = validation.email?.invalid || "Email is invalid";

    if (!form.phone) newErrors.phone = validation.phone?.required || "Phone is required";
    else if (!/^[\d\s\-()]{7,}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = validation.phone?.invalid || "Phone number is invalid";

    if (!form.name) newErrors.name = validation.name?.required || "Name is required";

    if (!form.message) newErrors.message = validation.message?.required || "Message is required";

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

    try {
      console.log("📨 Sending contact form data:", form);
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      console.log("✅ Contact form submitted successfully:", data);
      
      setSubmitted(true);
      
      // Reset form
      setForm({
        email: "",
        phone: "",
        name: "",
        message: "",
      });

    } catch (error) {
      console.error("❌ Contact form submission error:", error);
      setErrors({ 
        submit: error.message || "Failed to send message. Please try again." 
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eaf3f3] text-[#0f2f2f]">
      {/* <Navbar/> */}
      
      {/* HERO */}
      <section className="text-center px-4 py-20">
        <h1 className="text-3xl md:text-4xl font-bold">
          {hero.title || "Contact Us"}
        </h1>
        <p className="mt-2 max-w-xl mx-auto text-gray-600">
          {hero.subtitle || "Get in touch with us for any inquiries or support"}
        </p>
      </section>

      {/* 2-Column Layout */}
      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 mb-20">
        {/* LEFT SIDE - INFO CARDS */}
        <div className="flex flex-col gap-4">
          {contactInfo.length > 0 ? (
            contactInfo.map((item, i) => (
              <div key={i} className="bg-[#dbeaea] p-5 rounded-2xl flex items-center gap-4">
                <div className="text-3xl sm:text-4xl">{item.icon || "📞"}</div>
                <div>
                  <h4 className="font-semibold">{item.title || "Contact Info"}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description || "Contact description"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            // Fallback if no contact info
            <>
              <div className="bg-[#dbeaea] p-5 rounded-2xl flex items-center gap-4">
                <div className="text-3xl sm:text-4xl">📞</div>
                <div>
                  <h4 className="font-semibold">(+91)-9525446820</h4>
                  <p className="text-sm text-gray-600 mt-1">Call us for any questions or support</p>
                </div>
              </div>
              <div className="bg-[#dbeaea] p-5 rounded-2xl flex items-center gap-4">
                <div className="text-3xl sm:text-4xl">✉️</div>
                <div>
                  <h4 className="font-semibold">mail@influenca.id</h4>
                  <p className="text-sm text-gray-6 00 mt-1">Email us for business inquiries</p>
                </div>
              </div>
              <div className="bg-[#dbeaea] p-5 rounded-2xl flex items-center gap-4">
                <div className="text-3xl sm:text-4xl">📍</div>
                <div>
                  <h4 className="font-semibold">London Eye London</h4>
                  <p className="text-sm text-gray-600 mt-1">Our main office location</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE - CONTACT FORM */}
        <form
          onSubmit={handleSubmit}
          className={`bg-[#dbeaea] p-5 rounded-2xl ${shake ? "animate-shake" : ""}`}
          noValidate
        >
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="field-label">
                {formLabels.email || "Email *"}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`field-input ${errors.email ? "input-error" : ""}`}
                aria-invalid={errors.email ? "true" : "false"}
                placeholder={formPlaceholders.email || "Enter your email address"}
                disabled={isLoading}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div>
              <label className="field-label">
                {formLabels.phone || "Phone *"}
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`field-input ${errors.phone ? "input-error" : ""}`}
                aria-invalid={errors.phone ? "true" : "false"}
                placeholder={formPlaceholders.phone || "Enter your phone number"}
                disabled={isLoading}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>
          </div>

          <div className="mt-3">
            <label className="field-label">
              {formLabels.name || "Name *"}
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`field-input ${errors.name ? "input-error" : ""}`}
              aria-invalid={errors.name ? "true" : "false"}
              placeholder={formPlaceholders.name || "Enter your full name"}
              disabled={isLoading}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="mt-3">
            <label className="field-label">
              {formLabels.message || "Message *"}
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className={`field-input h-28 resize-none ${errors.message ? "input-error" : ""}`}
              aria-invalid={errors.message ? "true" : "false"}
              placeholder={formPlaceholders.message || "Type your message here..."}
              disabled={isLoading}
            />
            {errors.message && <p className="error-text">{errors.message}</p>}
          </div>

          {errors.submit && (
            <p className="error-text mt-2">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary mt-4 w-full sm:w-auto hover:scale-105 transition-transform duration-300 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading 
              ? (formButtons.submittingButton || "Sending...") 
              : (formButtons.submitButton || "Submit Message")
            }
          </button>

          {submitted && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">
                {formButtons.successMessage || "✅ Message sent successfully! Check your email for confirmation."}
              </p>
              <p className="text-green-600 text-xs mt-1">
                We've sent a confirmation email to {form.email}
              </p>
            </div>
          )}
        </form>
      </section>
      {/* <Footer/> */}

      {/* INLINE STYLES */}
      <style jsx>{`
        .field-label {
          display: block;
          font-size: 13px;
          margin-bottom: 4px;
          color: #374151;
        }

        .field-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.7);
          outline: none;
          transition: border-color 0.3s ease;
        }

        .field-input:focus {
          border-color: rgba(0, 0, 0, 0.35);
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
        }

        .field-input:disabled {
          background-color: rgba(255, 255, 255, 0.5);
          cursor: not-allowed;
        }

        .input-error {
          border-color: #e53e3e !important;
          animation: shake 0.3s;
        }

        .error-text {
          color: #e53e3e;
          font-size: 12px;
          margin-top: 2px;
        }

        .btn-primary {
          background: #6f9e9e;
          padding: 12px 30px;
          border-radius: 999px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
          border: none;
          outline: none;
          font-size: 16px;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #5b7f7f;
          transform: scale(1.05);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        .animate-shake {
          animation: shake 0.3s;
        }
      `}</style>
    </main>
  );
}