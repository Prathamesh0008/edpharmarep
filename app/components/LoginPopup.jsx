//app\components\LoginPopup.jsx
"use client";
import { useState, useEffect, useRef } from "react";

export default function LoginPopup({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    // We removed 'address' string since we now use detailed fields
    gender: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  // Detailed address inputs
  const [addrDetails, setAddrDetails] = useState({
    street: "",
    city: "",
    pincode: "",
  });

  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [cityError, setCityError] = useState("");

  const abortControllerRef = useRef(null);

  // Animation logic
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setMessage("");
      setFormData({
        username: "",
        email: "",
        gender: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });
      setAddrDetails({ street: "", city: "", pincode: "" });
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && abortControllerRef.current) {
      abortControllerRef.current.abort(); // stop API call
      abortControllerRef.current = null; // clear reference
      setMessage(""); // clear "Processing..."
    }
  }, [isOpen]);

  const switchMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setFormData({
      username: "",
      email: "",
      gender: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });
    setAddrDetails({ street: "", city: "", pincode: "" });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❗ Confirm password check (REGISTER ONLY)
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setMessage("Processing...");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

      // ✅ PAYLOAD FIX
      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,

            street: addrDetails.street,
            city: addrDetails.city,
            pincode: addrDetails.pincode,

            gender: formData.gender,
            mobile: formData.mobile,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "Operation failed");
        return;
      }

      // ✅ LOGIN SUCCESS
      // ✅ LOGIN / SIGNUP SUCCESS
if (isLogin) {
  const userObj = {
    _id: data.user._id || data.user.id,
    username:
      data.user.username ||
      data.user.name ||
      data.user.fullName ||
      data.user.email?.split("@")[0],
    email: data.user.email,
  };

  localStorage.setItem("bio-user", JSON.stringify(userObj));

  onLoginSuccess(userObj);
  onClose();
} else {
  // ✅ SIGNUP SUCCESS
  setMessage("Account created! Please login.");
  setIsLogin(true);
}

    } catch (err) {
      if (err.name === "AbortError") return;
      setMessage("Server error. Please try again.");
    }
  };

  // Shared Input Styles for Consistency (Square look)
  const inputStyle =
    "w-full px-4 py-3 bg-gray-50/50 border border-gray-200 focus:bg-white text-gray-700 text-sm outline-none focus:border-[#2f609b] focus:ring-1 focus:ring-[#2f609b] transition-all rounded-none placeholder:text-gray-400";

  return (
    <div
      className={`fixed inset-0 z-[100] flex justify-center items-center transition-all duration-500 ease-in-out px-4 py-4
      ${
        isOpen
          ? "bg-[#0f172a]/70 backdrop-blur-md opacity-100"
          : "bg-transparent opacity-0 pointer-events-none"
      }`}
    >
      <div
        // Square shape (rounded-sm) with elegant shadow
        className={`bg-white w-[95%] sm:w-[90%] md:w-full max-w-[500px] rounded-sm shadow-2xl relative flex flex-col p-8 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        ${
          isOpen
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-90 translate-y-10 opacity-0"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            // Abort API request if running
            if (abortControllerRef.current) {
              abortControllerRef.current.abort();
              abortControllerRef.current = null;
            }

            // Reset states
            setMessage("");
            setFormData({
              username: "",
              email: "",
              gender: "",
              mobile: "",
              password: "",
              confirmPassword: "",
            });
            setAddrDetails({ street: "", city: "", pincode: "" });

            onClose();
          }}
          className="absolute top-4 right-4 text-gray-300 hover:text-[#2f609b] transition-colors duration-200 text-xl font-bold p-2 z-10"
        >
          ✕
        </button>

        {/* Brand Header with Gradient Text */}
        <div className="text-center mb-8 mt-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#1d275e] to-[#2f609b]">
            {isLogin ? "Welcome Back" : "Join EdPharma"}
          </h2>
          <p className="text-gray-400 text-xs font-medium mt-2 uppercase tracking-wide">
            {isLogin
              ? "Access your medical dashboard"
              : "Create your secure account"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          autoComplete="off"
        >
          {!isLogin && (
            <div className="group">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                required
                className={inputStyle}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          )}

          <div className="group">
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              required
              className={inputStyle}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {!isLogin && (
            <>
              {/* --- ADDRESS SECTION (Clean Grid) --- */}
              <div className="pt-2 pb-1">
                <label className="block text-[10px] font-bold text-[#2f609b] uppercase tracking-wider mb-2 ml-1">
                  Pharmacy Address
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Street / Area / Building"
                    value={addrDetails.street}
                    className={inputStyle}
                    onChange={(e) =>
                      setAddrDetails({ ...addrDetails, street: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {/* CITY */}
                    <div className="group">
                      <input
                        type="text"
                        placeholder="City"
                        value={addrDetails.city}
                        className={inputStyle}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value === "") {
                            setCityError("");
                          } else if (/[^a-zA-Z\s]/.test(value)) {
                            setCityError("This is not valid");
                          } else {
                            setCityError("");
                          }

                          setAddrDetails({
                            ...addrDetails,
                            city: value.replace(/[^a-zA-Z\s]/g, ""),
                          });
                        }}
                      />

                      {cityError && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">
                          {cityError}
                        </p>
                      )}
                    </div>

                    {/* PINCODE */}
                    <div className="group">
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={addrDetails.pincode}
                        className={inputStyle}
                        inputMode="numeric"
                        maxLength={6}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value === "") {
                            setPincodeError("");
                          } else if (/[^0-9]/.test(value)) {
                            setPincodeError("This is not valid");
                          } else {
                            setPincodeError("");
                          }

                          setAddrDetails({
                            ...addrDetails,
                            pincode: value.replace(/[^0-9]/g, ""),
                          });
                        }}
                      />

                      {pincodeError && (
                        <p className="text-red-500 text-[11px] mt-1 font-medium">
                          {pincodeError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div className="group">
                  <input
                    type="tel"
                    placeholder="Mobile No."
                    value={formData.mobile}
                    className={inputStyle}
                    inputMode="numeric"
                    maxLength={15}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ❌ letters / symbols detect
                      if (/[^0-9]/.test(value)) {
                        setMobileError("This is not valid");
                      } else {
                        setMobileError("");
                      }

                      // ✅ store only numbers
                      setFormData({
                        ...formData,
                        mobile: value.replace(/[^0-9]/g, ""),
                      });
                    }}
                  />
                  {mobileError && (
                    <p className="text-red-500 text-[11px] mt-1 font-medium">
                      {mobileError}
                    </p>
                  )}
                </div>
                <div className="group">
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className={`${inputStyle} appearance-none`}
                  >
                    <option value="" disabled>
                      Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              required
              autoComplete="new-password"
              className={inputStyle}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {!isLogin && (
            <div className="group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                required
                autoComplete="new-password"
                className={inputStyle}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1d275e] to-[#2f609b] text-white py-4 font-bold text-sm tracking-widest uppercase mt-4 hover:shadow-lg hover:to-[#1d275e] active:scale-[0.99] transition-all duration-300 rounded-none"
          >
            {isLogin ? "Secure Login" : "Create Account"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-none text-xs font-bold text-center border-l-4 ${
              message.toLowerCase().includes("success") ||
              message.toLowerCase().includes("created")
                ? "bg-green-50 text-green-700 border-green-500"
                : "bg-red-50 text-red-700 border-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-gray-400 text-xs font-medium">
            {isLogin
              ? "Don't have an account yet?"
              : "Already have an account?"}
          </p>
          <button
            className="text-[#2f609b] text-sm font-bold hover:text-[#1d275e] transition-colors mt-2 uppercase tracking-wide"
            onClick={switchMode}
          >
            {isLogin ? "Register New Pharmacy" : "Login to Existing Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
