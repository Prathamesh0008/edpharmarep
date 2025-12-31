//Ed_Pharma\app\contact\page.jsx
"use client";

import { useState } from "react";
import Navbar  from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";

    if (!form.phone) newErrors.phone = "Phone is required";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) newErrors.phone = "Phone number is invalid";

    if (!form.name) newErrors.name = "Name is required";

    if (!form.message) newErrors.message = "Message is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    console.log("Form Data:", form);
    setSubmitted(true);
    setErrors({});

    setForm({
      email: "",
      phone: "",
      name: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#eaf3f3] text-[#0f2f2f]">
<Navbar/>
      {/* HERO */}
      <section className="text-center px-4 py-20">
        <h1 className="text-3xl md:text-4xl font-bold">
          Contact Us
        </h1>
        <p className="mt-2 max-w-xl mx-auto text-gray-600"></p>
      </section>

      {/* 2-Column Layout */}
      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 mb-20">


        {/* LEFT SIDE - INFO CARDS */}
        <div className="flex flex-col gap-4">
          {[
            { icon: "📞", title: "(+91)-9525446820", desc: "Lorem ipsum dolor sit amet." },
            { icon: "✉️", title: "mail@influenca.id", desc: "Lorem ipsum dolor sit amet." },
            { icon: "📍", title: "London Eye London", desc: "Lorem ipsum dolor sit amet." },
          ].map((item, i) => (
            <div key={i} className="bg-[#dbeaea] p-5 rounded-2xl flex items-center gap-4">
              <div className="text-3xl sm:text-4xl">{item.icon}</div>
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE - CONTACT FORM */}
        <form
          onSubmit={handleSubmit}
          className={`bg-[#dbeaea] p-5 rounded-2xl ${shake ? "animate-shake" : ""}`}
          noValidate
        >
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`field-input ${errors.email ? "input-error" : ""}`}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div>
              <label className="field-label">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`field-input ${errors.phone ? "input-error" : ""}`}
                aria-invalid={errors.phone ? "true" : "false"}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>
          </div>

          <div className="mt-3">
            <label className="field-label">Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`field-input ${errors.name ? "input-error" : ""}`}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="mt-3">
            <label className="field-label">Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className={`field-input h-28 resize-none ${errors.message ? "input-error" : ""}`}
              aria-invalid={errors.message ? "true" : "false"}
            />
            {errors.message && <p className="error-text">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="btn-primary mt-4 w-full sm:w-auto hover:scale-105 transition-transform duration-300"
          >
            Submit Button
          </button>

          {submitted && (
            <p className="mt-3 text-green-700 text-sm">
              ✅ Message sent successfully!
            </p>
          )}
        </form>

      </section>
      <Footer/>

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
          padding: 10px 26px;
          border-radius: 999px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
          border: none;
          outline: none;
        }

        .btn-primary:hover {
          background-color: #5b7f7f;
          transform: scale(1.05);
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