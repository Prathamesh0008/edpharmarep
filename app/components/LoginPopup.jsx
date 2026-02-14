// app/components/LoginPopup.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPopup({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [addrDetails, setAddrDetails] = useState({
    street: "",
    city: "",
    pincode: "",
  });

  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  
  // Validation error states
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    gender: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [mobileError, setMobileError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [cityError, setCityError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100vh");

  const router = useRouter();
  const { login } = useAuth();
  const abortControllerRef = useRef(null);
  const modalRef = useRef(null);

  // Admin credentials from environment variables
  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@edpharma.com";
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin@123";

  // Validation functions
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    
    // Check if it's admin email (allow exact match)
    if (email === ADMIN_EMAIL) return "";
    
    // Gmail validation - must end with @gmail.com
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return "Only Gmail addresses are allowed (must end with @gmail.com)";
    }
    
    // Additional check for valid Gmail format
    const localPart = email.split('@')[0];
    if (localPart.length < 6) {
      return "Gmail username must be at least 6 characters";
    }
    if (localPart.length > 30) {
      return "Gmail username is too long";
    }
    if (/[^a-zA-Z0-9._%+-]/.test(localPart)) {
      return "Gmail username contains invalid characters";
    }
    
    return "";
  };

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    
    // Allow letters, spaces, dots, hyphens, apostrophes for names
    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    if (!nameRegex.test(username)) {
      return "Username can only contain letters, spaces, dots, hyphens, and apostrophes";
    }
    
    // Check minimum length (after trimming)
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      return "Username must be at least 2 characters";
    }
    if (trimmed.length > 50) {
      return "Username is too long";
    }
    
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    
    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character";
    }
    
    return "";
  };

  const validateMobile = (mobile) => {
    if (!mobile) return "Mobile number is required";
    
    // Must be exactly 10 digits
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return "Mobile number must be exactly 10 digits";
    }
    
    // Check if starts with valid Indian mobile prefixes (6-9)
    const firstDigit = mobile.charAt(0);
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
      return "Mobile number must start with 6, 7, 8, or 9";
    }
    
    return "";
  };

  const validatePincode = (pincode) => {
    if (!pincode) return "Pincode is required";
    
    // Must be exactly 6 digits
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(pincode)) {
      return "Pincode must be exactly 6 digits and cannot start with 0";
    }
    
    return "";
  };

  const validateCity = (city) => {
    if (!city) return "City is required";
    
    // Allow only letters and spaces
    const cityRegex = /^[a-zA-Z\s]+$/;
    if (!cityRegex.test(city)) {
      return "City can only contain letters and spaces";
    }
    
    if (city.trim().length < 2) {
      return "City name must be at least 2 characters";
    }
    
    return "";
  };

  const validateStreet = (street) => {
    if (!street) return "Street address is required";
    
    // Allow letters, numbers, spaces, commas, periods, hyphens, slashes
    const streetRegex = /^[a-zA-Z0-9\s,./-]+$/;
    if (!streetRegex.test(street)) {
      return "Street address contains invalid characters";
    }
    
    if (street.trim().length < 5) {
      return "Street address must be at least 5 characters";
    }
    
    return "";
  };

  const validateGender = (gender) => {
    if (!gender) return "Please select a gender";
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  // Real-time validation handlers
  const handleUsernameChange = (value) => {
    setFormData({ ...formData, username: value });
    setErrors({ ...errors, username: validateUsername(value) });
  };

  const handleEmailChange = (value) => {
    setFormData({ ...formData, email: value });
    setErrors({ ...errors, email: validateEmail(value) });
  };

  const handleMobileChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length <= 10) {
      setFormData({ ...formData, mobile: numericValue });
      setErrors({ ...errors, mobile: validateMobile(numericValue) });
    }
  };

  const handlePasswordChange = (value) => {
    setFormData({ ...formData, password: value });
    setErrors({ ...errors, password: validatePassword(value) });
    
    // Also validate confirm password if it exists
    if (formData.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: validateConfirmPassword(value, formData.confirmPassword),
        password: validatePassword(value)
      });
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setFormData({ ...formData, confirmPassword: value });
    setErrors({
      ...errors,
      confirmPassword: validateConfirmPassword(formData.password, value)
    });
  };

  const handleCityChange = (value) => {
    const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
    setAddrDetails({ ...addrDetails, city: lettersOnly });
    setErrors({ ...errors, city: validateCity(lettersOnly) });
  };

  const handlePincodeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length <= 6) {
      setAddrDetails({ ...addrDetails, pincode: numericValue });
      setErrors({ ...errors, pincode: validatePincode(numericValue) });
    }
  };

  const handleStreetChange = (value) => {
    setAddrDetails({ ...addrDetails, street: value });
    setErrors({ ...errors, street: validateStreet(value) });
  };

  const handleGenderChange = (value) => {
    setFormData({ ...formData, gender: value });
    setErrors({ ...errors, gender: validateGender(value) });
  };

  // Check if mobile device and handle iOS viewport issues
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);

      // Fix for iOS viewport height issues
      const vh = window.innerHeight * 0.01;
      setViewportHeight(`${vh}px`);
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, []);

  // Prevent zoom on iOS inputs
  useEffect(() => {
    const handleViewportMeta = () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta && isMobile) {
        // Store original content
        const originalContent = viewportMeta.getAttribute("content");
        viewportMeta.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        );

        return () => {
          viewportMeta.setAttribute("content", originalContent);
        };
      }
    };

    if (isOpen && isMobile) {
      return handleViewportMeta();
    }
  }, [isOpen, isMobile]);

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
      setErrors({
        username: "",
        email: "",
        gender: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        street: "",
        city: "",
        pincode: "",
      });

      // Prevent background scrolling on mobile
      if (isMobile) {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => {
        clearTimeout(timer);
        // Restore scrolling
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
      };
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (!isOpen && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setMessage("");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    setErrors({
      username: "",
      email: "",
      gender: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      street: "",
      city: "",
      pincode: "",
    });
  };

  // Simple login function for localStorage
  const loginUser = (userData) => {
    localStorage.setItem("bio-user", JSON.stringify(userData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let hasErrors = false;
    const newErrors = { ...errors };

    if (!isLogin) {
      // Registration validation
      newErrors.username = validateUsername(formData.username);
      newErrors.email = validateEmail(formData.email);
      newErrors.mobile = validateMobile(formData.mobile);
      newErrors.gender = validateGender(formData.gender);
      newErrors.password = validatePassword(formData.password);
      newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
      newErrors.street = validateStreet(addrDetails.street);
      newErrors.city = validateCity(addrDetails.city);
      newErrors.pincode = validatePincode(addrDetails.pincode);

      hasErrors = Object.values(newErrors).some(error => error !== "");
    } else {
      // Login validation
      newErrors.email = validateEmail(formData.email);
      newErrors.password = validatePassword(formData.password);
      
      hasErrors = newErrors.email !== "" || newErrors.password !== "";
    }

    setErrors(newErrors);

    if (hasErrors) {
      setMessage("Please fix all errors before submitting");
      return;
    }

    console.log("🔍 LoginPopup: Form submitted");
    console.log("🔍 LoginPopup: Email entered:", formData.email);
    console.log("🔍 LoginPopup: Password entered:", formData.password);

    // Admin credentials from environment variables
    const ADMIN_EMAIL =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@edpharma.com";
    const ADMIN_PASSWORD =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin@123";

    console.log("🔍 LoginPopup: Admin email from env:", ADMIN_EMAIL);
    console.log("🔍 LoginPopup: Admin password from env:", ADMIN_PASSWORD);

    // Check if admin credentials are entered
    if (
      isLogin &&
      formData.email === ADMIN_EMAIL &&
      formData.password === ADMIN_PASSWORD
    ) {
      console.log("🔍 LoginPopup: ADMIN CREDENTIALS MATCHED!");

      // Create admin user object
      const adminUser = {
        _id: "admin",
        username: "Admin",
        email: ADMIN_EMAIL,
        role: "admin",
      };

      console.log("🔍 LoginPopup: Admin user object created:", adminUser);

      // Store in context and localStorage
      login(adminUser);

      // Call success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(adminUser);
      }

      // Close popup
      onClose();

      console.log("🔍 LoginPopup: Redirecting to /admin/dashboard");

      // Redirect to admin panel
      router.push("/admin/dashboard");

      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setMessage("Processing...");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

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

      if (isLogin) {
        // ✅ CRITICAL: Store token in localStorage
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }

        const userObj = {
          _id: data.user._id,
          username: data.user.username,
          email: data.user.email,
          mobile: data.user.mobile,
          gender: data.user.gender,
          street: data.user.street,
          city: data.user.city,
          pincode: data.user.pincode,
        };

        // Store in localStorage
        localStorage.setItem("bio-user", JSON.stringify(userObj));

        // Update context
        if (login) {
          login(userObj);
        }

        if (onLoginSuccess) {
          onLoginSuccess(userObj);
        }

        onClose();

        // Redirect to profile
        router.push("/profile");
      } else {
        setMessage("Account created! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      setMessage("Server error. Please try again.");
    }
  };

  // Responsive input styles with iOS fixes
  const inputStyle = `
    w-full px-4 py-3
    bg-gray-50 border border-gray-200 
    focus:bg-white text-gray-700 
    text-base
    outline-none focus:border-[#2f609b] 
    focus:ring-1 focus:ring-[#2f609b] 
    transition-all rounded-lg
    placeholder:text-gray-400
    appearance-none
    -webkit-appearance: none
    -webkit-tap-highlight-color: transparent
    touch-action: manipulation
    min-height: 48px
    font-size: 16px /* Prevents iOS zoom */
  `;

  const errorInputStyle = `
    ${inputStyle}
    border-red-300 focus:border-red-500 focus:ring-red-200
    bg-red-50
  `;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex justify-center items-start sm:items-center 
        transition-all duration-300 ease-in-out px-4
        ${
          isOpen
            ? "bg-[#0f172a]/90 backdrop-blur-sm opacity-100"
            : "bg-transparent opacity-0 pointer-events-none"
        }
      `}
      style={{
        height: isMobile ? "100vh" : "100%",
        minHeight: isMobile ? "-webkit-fill-available" : "100%",
      }}
    >
      <div
        ref={modalRef}
        className={`
          bg-white w-full
          ${
            isMobile
              ? "max-w-full rounded-t-2xl rounded-b-none mt-12"
              : "max-w-[500px] rounded-2xl"
          }
          shadow-2xl relative flex flex-col 
          transition-all duration-300 ease-out
          transform overflow-y-auto
          ${isMobile ? "p-6" : "p-8"}
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
        `}
        style={{
          maxHeight: isMobile
            ? `calc(${viewportHeight} * 90)`
            : "calc(100vh - 4rem)",
          height: isMobile ? "auto" : "auto",
          minHeight: isMobile ? "60vh" : "auto",
        }}
      >
        {/* Close Button - Mobile optimized */}
        <button
          onClick={() => {
            if (abortControllerRef.current) {
              abortControllerRef.current.abort();
              abortControllerRef.current = null;
            }
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
            setErrors({
              username: "",
              email: "",
              gender: "",
              mobile: "",
              password: "",
              confirmPassword: "",
              street: "",
              city: "",
              pincode: "",
            });
            onClose();
          }}
          className={`
            absolute ${isMobile ? "top-4 right-4" : "top-6 right-6"}
            text-gray-400 hover:text-[#2f609b] 
            transition-colors duration-200 
            ${isMobile ? "text-2xl w-10 h-10" : "text-xl w-12 h-12"}
            flex items-center justify-center
            z-10
            active:bg-gray-100 rounded-full
          `}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8 mt-0 sm:mt-2 flex flex-col items-center justify-center">
          <h2
            className={`
            font-extrabold tracking-tight text-transparent 
            bg-clip-text bg-gradient-to-r from-[#1d275e] to-[#2f609b]
            ${isMobile ? "text-2xl mb-2" : "text-3xl mb-3"}
          `}
          >
            {isLogin ? "Welcome Back" : "Join EdPharma"}
          </h2>
          <p
            className={`
            text-gray-400 font-medium uppercase tracking-wide
            ${isMobile ? "text-xs" : "text-sm"}
          `}
          >
            {isLogin
              ? "Access your medical dashboard"
              : "Create your secure account"}
          </p>

          {/* Admin Login Hint (only in login mode) */}
          {isLogin && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Admin access available</p>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          autoComplete="off"
        >
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                required
                className={errors.username ? errorInputStyle : inputStyle}
                onChange={(e) => handleUsernameChange(e.target.value)}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.username}
                </p>
              )}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email Address (must be @gmail.com)"
              value={formData.email}
              required
              className={errors.email ? errorInputStyle : inputStyle}
              onChange={(e) => handleEmailChange(e.target.value)}
              inputMode="email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {!isLogin && (
            <>
              {/* Address Section */}
              <div className="pt-2 pb-1">
                <label
                  className={`
                  block font-bold text-[#2f609b] 
                  uppercase tracking-wider mb-3
                  ${isMobile ? "text-xs" : "text-sm"}
                `}
                >
                  Pharmacy Address
                </label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Street / Area / Building"
                      value={addrDetails.street}
                      className={errors.street ? errorInputStyle : inputStyle}
                      onChange={(e) => handleStreetChange(e.target.value)}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.street}
                      </p>
                    )}
                  </div>
                  <div
                    className={`grid ${
                      isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
                    }`}
                  >
                    {/* City */}
                    <div>
                      <input
                        type="text"
                        placeholder="City"
                        value={addrDetails.city}
                        className={errors.city ? errorInputStyle : inputStyle}
                        onChange={(e) => handleCityChange(e.target.value)}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    {/* Pincode */}
                    <div>
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={addrDetails.pincode}
                        className={errors.pincode ? errorInputStyle : inputStyle}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile & Gender */}
              <div
                className={`grid ${
                  isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
                }`}
              >
                <div>
                  <input
                    type="tel"
                    placeholder="Mobile No. (10 digits)"
                    value={formData.mobile}
                    className={errors.mobile ? errorInputStyle : inputStyle}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    onChange={(e) => handleMobileChange(e.target.value)}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.mobile}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) => handleGenderChange(e.target.value)}
                    className={errors.gender ? errorInputStyle : inputStyle}
                  >
                    <option value="" disabled>
                      Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              required
              autoComplete="new-password"
              className={errors.password ? errorInputStyle : inputStyle}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                required
                autoComplete="new-password"
                className={errors.confirmPassword ? errorInputStyle : inputStyle}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className={`
              w-full bg-gradient-to-r from-[#1d275e] to-[#2f609b] 
              text-white font-bold uppercase 
              hover:shadow-lg hover:to-[#1d275e] 
              active:scale-[0.98] transition-all duration-300 
              rounded-lg
              ${isMobile ? "py-4 text-base" : "py-4 text-base"}
              mt-4
              min-height: 48px
              touch-action: manipulation
              cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={Object.values(errors).some(error => error !== "")}
          >
            {isLogin ? "Secure Login" : "Create Account"}
          </button>
        </form>

        {message && (
          <div
            className={`
              mt-4 p-3 rounded-lg text-sm font-medium 
              text-center border
              ${
                message.toLowerCase().includes("success") ||
                message.toLowerCase().includes("created")
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }
            `}
          >
            {message}
          </div>
        )}

        <div
          className={`
          mt-6 text-center pt-4
          border-t border-gray-100
        `}
        >
          <p
            className={`
            text-gray-400 font-medium
            ${isMobile ? "text-sm" : "text-sm"}
          `}
          >
            {isLogin
              ? "Don't have an account yet?"
              : "Already have an account?"}
          </p>
          <button
            className={`
              text-[#2f609b] font-bold hover:text-[#1d275e] 
              transition-colors mt-2 text-base
              active:text-[#1d275e]
              cursor-pointer
            `}
            onClick={switchMode}
            type="button"
          >
            {isLogin ? "Register New Pharmacy" : "Login to Existing Account"}
          </button>
        </div>
      </div>
    </div>
  );
}


// app/components/LoginPopup.jsx
// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/AuthContext";

// export default function LoginPopup({ isOpen, onClose, onLoginSuccess }) {
//   const [isLogin, setIsLogin] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     gender: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [addrDetails, setAddrDetails] = useState({
//     street: "",
//     city: "",
//     pincode: "",
//     country: "", // Added country field for European addresses
//   });

//   const [message, setMessage] = useState("");
//   const [isVisible, setIsVisible] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [viewportHeight, setViewportHeight] = useState("100vh");

//   // Validation errors state
//   const [errors, setErrors] = useState({
//     username: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//     street: "",
//     city: "",
//     pincode: "",
//     country: "",
//     gender: "",
//   });

//   const router = useRouter();
//   const { login } = useAuth();
//   const abortControllerRef = useRef(null);
//   const modalRef = useRef(null);

//   // Admin credentials from environment variables
//   const ADMIN_EMAIL =
//     process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@edpharma.com";
//   const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin@123";

//   // European countries list
//   const EUROPEAN_COUNTRIES = [
//     "Albania", "Andorra", "Austria", "Belarus", "Belgium", 
//     "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", 
//     "Czech Republic", "Denmark", "Estonia", "Finland", "France", 
//     "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", 
//     "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", 
//     "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", 
//     "Norway", "Poland", "Portugal", "Romania", "San Marino", 
//     "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", 
//     "Switzerland", "Ukraine", "United Kingdom", "Vatican City"
//   ];

//   // Check if mobile device and handle iOS viewport issues
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);

//       // Fix for iOS viewport height issues
//       const vh = window.innerHeight * 0.01;
//       setViewportHeight(`${vh}px`);
//       document.documentElement.style.setProperty("--vh", `${vh}px`);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     window.addEventListener("orientationchange", checkMobile);

//     return () => {
//       window.removeEventListener("resize", checkMobile);
//       window.removeEventListener("orientationchange", checkMobile);
//     };
//   }, []);

//   // Prevent zoom on iOS inputs
//   useEffect(() => {
//     const handleViewportMeta = () => {
//       const viewportMeta = document.querySelector('meta[name="viewport"]');
//       if (viewportMeta && isMobile) {
//         const originalContent = viewportMeta.getAttribute("content");
//         viewportMeta.setAttribute(
//           "content",
//           "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
//         );

//         return () => {
//           viewportMeta.setAttribute("content", originalContent);
//         };
//       }
//     };

//     if (isOpen && isMobile) {
//       return handleViewportMeta();
//     }
//   }, [isOpen, isMobile]);

//   // Animation logic
//   useEffect(() => {
//     if (isOpen) {
//       setIsVisible(true);
//       setMessage("");
//       setFormData({
//         username: "",
//         email: "",
//         gender: "",
//         mobile: "",
//         password: "",
//         confirmPassword: "",
//       });
//       setAddrDetails({ street: "", city: "", pincode: "", country: "" });
//       setErrors({});

//       // Prevent background scrolling on mobile
//       if (isMobile) {
//         document.body.style.overflow = "hidden";
//         document.body.style.position = "fixed";
//         document.body.style.width = "100%";
//       }
//     } else {
//       const timer = setTimeout(() => setIsVisible(false), 300);
//       return () => {
//         clearTimeout(timer);
//         // Restore scrolling
//         document.body.style.overflow = "";
//         document.body.style.position = "";
//         document.body.style.width = "";
//       };
//     }
//   }, [isOpen, isMobile]);

//   useEffect(() => {
//     if (!isOpen && abortControllerRef.current) {
//       abortControllerRef.current.abort();
//       abortControllerRef.current = null;
//       setMessage("");
//     }
//   }, [isOpen]);

//   // Handle escape key
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === "Escape" && isOpen) {
//         onClose();
//       }
//     };

//     window.addEventListener("keydown", handleEscape);
//     return () => window.removeEventListener("keydown", handleEscape);
//   }, [isOpen, onClose]);

//   // Handle click outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (modalRef.current && !modalRef.current.contains(e.target)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//       document.addEventListener("touchstart", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("touchstart", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   const switchMode = () => {
//     setIsLogin(!isLogin);
//     setMessage("");
//     setFormData({
//       username: "",
//       email: "",
//       gender: "",
//       mobile: "",
//       password: "",
//       confirmPassword: "",
//     });
//     setAddrDetails({ street: "", city: "", pincode: "", country: "" });
//     setErrors({});
//   };

//   // Validation functions (European standards)
//   const validateUsername = (username) => {
//     if (!username.trim()) return "Username is required";
//     if (username.length < 3) return "Username must be at least 3 characters";
//     if (username.length > 50) return "Username must not exceed 50 characters";
//     if (!/^[a-zA-Z\s\-'.]+$/.test(username)) 
//       return "Username can only contain letters, spaces, hyphens, and apostrophes";
//     if (/^\s|\s$/.test(username)) 
//       return "Username cannot start or end with spaces";
//     return "";
//   };

//   const validateEmail = (email) => {
//     if (!email.trim()) return "Email is required";
    
//     // RFC 5322 compliant email regex (European standard)
//     const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
//     if (!emailRegex.test(email)) return "Please enter a valid email address";
    
//     // Check for common email providers (optional, for better UX)
//     const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
//     const domain = email.split('@')[1];
//     if (domain && !commonDomains.includes(domain) && !domain.includes('.')) {
//       return "Please enter a complete email address with domain";
//     }
    
//     return "";
//   };

//   const validateMobile = (mobile, country = "") => {
//     if (!mobile.trim()) return "Mobile number is required";
    
//     // Remove all non-digit characters for validation
//     const digitsOnly = mobile.replace(/\D/g, '');
    
//     // European phone number formats
//     // E.164 format: + [country code] [national number]
//     // Maximum 15 digits total
    
//     if (digitsOnly.length < 8) return "Mobile number must be at least 8 digits";
//     if (digitsOnly.length > 15) return "Mobile number must not exceed 15 digits";
    
//     // Check if it has a valid European country code prefix
//     const hasValidPrefix = /^(\+?3|0|00)/.test(mobile) || 
//                           /^[0-9]{9,}$/.test(digitsOnly); // Local format
    
//     if (!hasValidPrefix && mobile.startsWith('+')) {
//       return "Please use a valid European country code";
//     }
    
//     // Country-specific validation if country is selected
//     if (country) {
//       switch(country) {
//         case "United Kingdom":
//           if (!/^(\+44|0)7\d{9}$/.test(mobile.replace(/\s/g, '')))
//             return "UK mobile numbers should start with 07 or +447";
//           break;
//         case "Germany":
//           if (!/^(\+49|0)1[5-7]\d{8,9}$/.test(mobile.replace(/\s/g, '')))
//             return "German mobile numbers should start with 015, 016, or 017";
//           break;
//         case "France":
//           if (!/^(\+33|0)6\d{8}$/.test(mobile.replace(/\s/g, '')))
//             return "French mobile numbers should start with 06 or +336";
//           break;
//         case "Italy":
//           if (!/^(\+39|0)3\d{8,9}$/.test(mobile.replace(/\s/g, '')))
//             return "Italian mobile numbers should start with 03 or +393";
//           break;
//         case "Spain":
//           if (!/^(\+34|0)6\d{8}$/.test(mobile.replace(/\s/g, '')))
//             return "Spanish mobile numbers should start with 06 or +346";
//           break;
//         case "Netherlands":
//           if (!/^(\+31|0)6\d{8}$/.test(mobile.replace(/\s/g, '')))
//             return "Dutch mobile numbers should start with 06 or +316";
//           break;
//       }
//     }
    
//     return "";
//   };

//   const validatePassword = (password) => {
//     if (!password) return "Password is required";
    
//     // GDPR/European password requirements
//     const requirements = [];
//     if (password.length < 8) requirements.push("at least 8 characters");
//     if (!/[A-Z]/.test(password)) requirements.push("an uppercase letter");
//     if (!/[a-z]/.test(password)) requirements.push("a lowercase letter");
//     if (!/[0-9]/.test(password)) requirements.push("a number");
//     if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) 
//       requirements.push("a special character");
    
//     if (requirements.length > 0) {
//       return `Password must contain: ${requirements.join(", ")}`;
//     }
    
//     // Check for common patterns
//     if (/(.)\1{3,}/.test(password)) 
//       return "Password cannot contain repeated characters";
    
//     return "";
//   };

//   const validateConfirmPassword = (password, confirmPassword) => {
//     if (!confirmPassword) return "Please confirm your password";
//     if (password !== confirmPassword) return "Passwords do not match";
//     return "";
//   };

//   const validateStreet = (street) => {
//     if (!street.trim()) return "Street address is required";
//     if (street.length < 5) return "Street address must be at least 5 characters";
//     if (street.length > 100) return "Street address must not exceed 100 characters";
//     if (!/^[a-zA-Z0-9\s\-',.]+$/.test(street))
//       return "Street address contains invalid characters";
//     return "";
//   };

//   const validateCity = (city) => {
//     if (!city.trim()) return "City is required";
//     if (city.length < 2) return "City must be at least 2 characters";
//     if (!/^[a-zA-Z\s\-']+$/.test(city))
//       return "City can only contain letters, spaces, hyphens, and apostrophes";
//     return "";
//   };

//   const validatePincode = (pincode, country = "") => {
//     if (!pincode.trim()) return "Postal code is required";
    
//     // Remove spaces for validation
//     const cleanPincode = pincode.replace(/\s/g, '');
    
//     // European postal code formats
//     if (country) {
//       switch(country) {
//         case "United Kingdom":
//           // UK postcode format: SW1A 1AA
//           if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(pincode))
//             return "Enter a valid UK postcode (e.g., SW1A 1AA)";
//           break;
//         case "Germany":
//           // German postcode: 5 digits
//           if (!/^\d{5}$/.test(cleanPincode))
//             return "German postal code must be 5 digits";
//           break;
//         case "France":
//           // French postcode: 5 digits
//           if (!/^\d{5}$/.test(cleanPincode))
//             return "French postal code must be 5 digits";
//           break;
//         case "Italy":
//           // Italian postcode: 5 digits
//           if (!/^\d{5}$/.test(cleanPincode))
//             return "Italian postal code must be 5 digits";
//           break;
//         case "Spain":
//           // Spanish postcode: 5 digits
//           if (!/^\d{5}$/.test(cleanPincode))
//             return "Spanish postal code must be 5 digits";
//           break;
//         case "Netherlands":
//           // Dutch postcode: 4 digits + 2 letters
//           if (!/^\d{4}\s?[A-Z]{2}$/i.test(pincode))
//             return "Dutch postal code must be 4 digits followed by 2 letters";
//           break;
//         case "Switzerland":
//           // Swiss postcode: 4 digits
//           if (!/^\d{4}$/.test(cleanPincode))
//             return "Swiss postal code must be 4 digits";
//           break;
//         default:
//           // Generic European format: mostly 4-6 digits
//           if (!/^\d{4,6}$/.test(cleanPincode))
//             return "Please enter a valid postal code (4-6 digits)";
//       }
//     } else {
//       // Generic validation if country not selected
//       if (!/^[A-Z0-9\s\-]{3,10}$/i.test(pincode))
//         return "Please enter a valid postal code format";
//     }
    
//     return "";
//   };

//   const validateGender = (gender) => {
//     if (!gender) return "Please select your gender";
//     return "";
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!isLogin) {
//       newErrors.username = validateUsername(formData.username);
//       newErrors.gender = validateGender(formData.gender);
//       newErrors.mobile = validateMobile(formData.mobile, addrDetails.country);
//       newErrors.street = validateStreet(addrDetails.street);
//       newErrors.city = validateCity(addrDetails.city);
//       newErrors.pincode = validatePincode(addrDetails.pincode, addrDetails.country);
//       newErrors.country = !addrDetails.country ? "Please select your country" : "";
//     }
    
//     newErrors.email = validateEmail(formData.email);
//     newErrors.password = validatePassword(formData.password);
    
//     if (!isLogin) {
//       newErrors.confirmPassword = validateConfirmPassword(
//         formData.password, 
//         formData.confirmPassword
//       );
//     }
    
//     setErrors(newErrors);
    
//     // Return true if no errors
//     return !Object.values(newErrors).some(error => error !== "");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("🔍 LoginPopup: Form submitted");
//     console.log("🔍 LoginPopup: Email entered:", formData.email);
//     console.log("🔍 LoginPopup: Password entered:", formData.password);

//     // Validate form before submission
//     if (!validateForm()) {
//       setMessage("Please fix the validation errors before submitting");
//       return;
//     }

//     // Admin credentials from environment variables
//     const ADMIN_EMAIL =
//       process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@edpharma.com";
//     const ADMIN_PASSWORD =
//       process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin@123";

//     console.log("🔍 LoginPopup: Admin email from env:", ADMIN_EMAIL);
//     console.log("🔍 LoginPopup: Admin password from env:", ADMIN_PASSWORD);

//     // Check if admin credentials are entered
//     if (
//       isLogin &&
//       formData.email === ADMIN_EMAIL &&
//       formData.password === ADMIN_PASSWORD
//     ) {
//       console.log("🔍 LoginPopup: ADMIN CREDENTIALS MATCHED!");

//       // Create admin user object
//       const adminUser = {
//         _id: "admin",
//         username: "Admin",
//         email: ADMIN_EMAIL,
//         role: "admin",
//       };

//       console.log("🔍 LoginPopup: Admin user object created:", adminUser);

//       // Store in context and localStorage
//       login(adminUser);

//       // Call success callback if provided
//       if (onLoginSuccess) {
//         onLoginSuccess(adminUser);
//       }

//       // Close popup
//       onClose();

//       console.log("🔍 LoginPopup: Redirecting to /admin/dashboard");

//       // Redirect to admin panel
//       router.push("/admin/dashboard");

//       return;
//     }

//     if (!isLogin && formData.password !== formData.confirmPassword) {
//       setMessage("Passwords do not match");
//       return;
//     }

//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     const controller = new AbortController();
//     abortControllerRef.current = controller;

//     setMessage("Processing...");

//     try {
//       const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

//       const payload = isLogin
//         ? {
//             email: formData.email,
//             password: formData.password,
//           }
//         : {
//             username: formData.username,
//             email: formData.email,
//             password: formData.password,
//             street: addrDetails.street,
//             city: addrDetails.city,
//             pincode: addrDetails.pincode,
//             country: addrDetails.country,
//             gender: formData.gender,
//             mobile: formData.mobile,
//           };

//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         signal: controller.signal,
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         setMessage(data.message || "Operation failed");
//         return;
//       }

//       if (isLogin) {
//         // ✅ CRITICAL: Store token in localStorage
//         if (data.token) {
//           localStorage.setItem("auth_token", data.token);
//         }

//         const userObj = {
//           _id: data.user._id,
//           username: data.user.username,
//           email: data.user.email,
//           mobile: data.user.mobile,
//           gender: data.user.gender,
//           street: data.user.street,
//           city: data.user.city,
//           pincode: data.user.pincode,
//           country: data.user.country,
//         };

//         // Store in localStorage
//         localStorage.setItem("bio-user", JSON.stringify(userObj));

//         // Update context
//         if (login) {
//           login(userObj);
//         }

//         if (onLoginSuccess) {
//           onLoginSuccess(userObj);
//         }

//         onClose();

//         // Redirect to profile
//         router.push("/profile");
//       } else {
//         setMessage("Account created! Please login.");
//         setIsLogin(true);
//       }
//     } catch (err) {
//       if (err.name === "AbortError") return;
//       setMessage("Server error. Please try again.");
//     }
//   };

//   const handleFieldChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
    
//     // Clear error for this field when user starts typing
//     if (errors[field]) {
//       setErrors({ ...errors, [field]: "" });
//     }
//   };

//   const handleAddressChange = (field, value) => {
//     setAddrDetails({ ...addrDetails, [field]: value });
    
//     // Clear error for this field when user starts typing
//     if (errors[field]) {
//       setErrors({ ...errors, [field]: "" });
//     }
//   };

//   // Format phone number as user types (European format)
//   const formatMobileNumber = (value) => {
//     // Remove all non-digit characters except +
//     let cleaned = value.replace(/[^\d+]/g, '');
    
//     // Ensure only one + at the beginning
//     if (cleaned.indexOf('+') > 0) {
//       cleaned = cleaned.replace(/\+/g, '');
//     }
    
//     return cleaned;
//   };

//   // Responsive input styles with iOS fixes
//   const inputStyle = `
//     w-full px-4 py-3
//     bg-gray-50 border border-gray-200 
//     focus:bg-white text-gray-700 
//     text-base
//     outline-none focus:border-[#2f609b] 
//     focus:ring-1 focus:ring-[#2f609b] 
//     transition-all rounded-lg
//     placeholder:text-gray-400
//     appearance-none
//     -webkit-appearance: none
//     -webkit-tap-highlight-color: transparent
//     touch-action: manipulation
//     min-height: 48px
//     font-size: 16px
//   `;

//   const errorInputStyle = `border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50`;

//   return (
//     <div
//       className={`
//         fixed inset-0 z-[9999] flex justify-center items-start sm:items-center 
//         transition-all duration-300 ease-in-out px-4
//         ${
//           isOpen
//             ? "bg-[#0f172a]/90 backdrop-blur-sm opacity-100"
//             : "bg-transparent opacity-0 pointer-events-none"
//         }
//       `}
//       style={{
//         height: isMobile ? "100vh" : "100%",
//         minHeight: isMobile ? "-webkit-fill-available" : "100%",
//       }}
//     >
//       <div
//         ref={modalRef}
//         className={`
//           bg-white w-full
//           ${
//             isMobile
//               ? "max-w-full rounded-t-2xl rounded-b-none mt-12"
//               : "max-w-[500px] rounded-2xl"
//           }
//           shadow-2xl relative flex flex-col 
//           transition-all duration-300 ease-out
//           transform overflow-y-auto
//           ${isMobile ? "p-6" : "p-8"}
//           ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
//         `}
//         style={{
//           maxHeight: isMobile
//             ? `calc(${viewportHeight} * 90)`
//             : "calc(100vh - 4rem)",
//           height: isMobile ? "auto" : "auto",
//           minHeight: isMobile ? "60vh" : "auto",
//         }}
//       >
//         {/* Close Button - Mobile optimized */}
//         <button
//           onClick={() => {
//             if (abortControllerRef.current) {
//               abortControllerRef.current.abort();
//               abortControllerRef.current = null;
//             }
//             setMessage("");
//             setFormData({
//               username: "",
//               email: "",
//               gender: "",
//               mobile: "",
//               password: "",
//               confirmPassword: "",
//             });
//             setAddrDetails({ street: "", city: "", pincode: "", country: "" });
//             setErrors({});
//             onClose();
//           }}
//           className={`
//             absolute ${isMobile ? "top-4 right-4" : "top-6 right-6"}
//             text-gray-400 hover:text-[#2f609b] 
//             transition-colors duration-200 
//             ${isMobile ? "text-2xl w-10 h-10" : "text-xl w-12 h-12"}
//             flex items-center justify-center
//             z-10
//             active:bg-gray-100 rounded-full
//           `}
//           aria-label="Close"
//         >
//           ✕
//         </button>

//         {/* Brand Header */}
//         <div className="text-center mb-6 sm:mb-8 mt-0 sm:mt-2 flex flex-col items-center justify-center">
//           <h2
//             className={`
//             font-extrabold tracking-tight text-transparent 
//             bg-clip-text bg-gradient-to-r from-[#1d275e] to-[#2f609b]
//             ${isMobile ? "text-2xl mb-2" : "text-3xl mb-3"}
//           `}
//           >
//             {isLogin ? "Welcome Back" : "Join EdPharma"}
//           </h2>
//           <p
//             className={`
//             text-gray-400 font-medium uppercase tracking-wide
//             ${isMobile ? "text-xs" : "text-sm"}
//           `}
//           >
//             {isLogin
//               ? "Access your medical dashboard"
//               : "Create your secure account"}
//           </p>

//           {/* GDPR Compliance Notice */}
//           <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
//             🔒 Your data is protected under GDPR
//           </div>

//           {/* Admin Login Hint (only in login mode) */}
//           {isLogin && (
//             <div className="mt-2">
//               <p className="text-xs text-gray-500">Admin access available</p>
//             </div>
//           )}
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col gap-4"
//           autoComplete="off"
//         >
//           {/* Username Field */}
//           {!isLogin && (
//             <div>
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={formData.username}
//                 required
//                 className={`${inputStyle} ${errors.username ? errorInputStyle : ''}`}
//                 onChange={(e) => handleFieldChange('username', e.target.value)}
//                 onBlur={() => {
//                   const error = validateUsername(formData.username);
//                   setErrors({ ...errors, username: error });
//                 }}
//               />
//               {errors.username && (
//                 <p className="text-red-500 text-xs mt-1 font-medium">
//                   {errors.username}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Email Field */}
//           <div>
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={formData.email}
//               required
//               className={`${inputStyle} ${errors.email ? errorInputStyle : ''}`}
//               onChange={(e) => handleFieldChange('email', e.target.value)}
//               onBlur={() => {
//                 const error = validateEmail(formData.email);
//                 setErrors({ ...errors, email: error });
//               }}
//               inputMode="email"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1 font-medium">
//                 {errors.email}
//               </p>
//             )}
//           </div>

//           {!isLogin && (
//             <>
//               {/* Address Section */}
//               <div className="pt-2 pb-1">
//                 <label
//                   className={`
//                   block font-bold text-[#2f609b] 
//                   uppercase tracking-wider mb-3
//                   ${isMobile ? "text-xs" : "text-sm"}
//                 `}
//                 >
//                   Pharmacy Address (European Format)
//                 </label>
                
//                 {/* Country Selection */}
//                 <div className="mb-3">
//                   <select
//                     value={addrDetails.country}
//                     onChange={(e) => handleAddressChange('country', e.target.value)}
//                     onBlur={() => {
//                       const error = !addrDetails.country ? "Please select your country" : "";
//                       setErrors({ ...errors, country: error });
//                     }}
//                     className={`${inputStyle} ${errors.country ? errorInputStyle : ''}`}
//                   >
//                     <option value="" disabled>Select European Country</option>
//                     {EUROPEAN_COUNTRIES.map(country => (
//                       <option key={country} value={country}>{country}</option>
//                     ))}
//                   </select>
//                   {errors.country && (
//                     <p className="text-red-500 text-xs mt-1 font-medium">
//                       {errors.country}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-3">
//                   <input
//                     type="text"
//                     placeholder="Street / Area / Building"
//                     value={addrDetails.street}
//                     className={`${inputStyle} ${errors.street ? errorInputStyle : ''}`}
//                     onChange={(e) => handleAddressChange('street', e.target.value)}
//                     onBlur={() => {
//                       const error = validateStreet(addrDetails.street);
//                       setErrors({ ...errors, street: error });
//                     }}
//                   />
//                   {errors.street && (
//                     <p className="text-red-500 text-xs mt-1 font-medium">
//                       {errors.street}
//                     </p>
//                   )}
                  
//                   <div
//                     className={`grid ${
//                       isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
//                     }`}
//                   >
//                     {/* City */}
//                     <div>
//                       <input
//                         type="text"
//                         placeholder="City"
//                         value={addrDetails.city}
//                         className={`${inputStyle} ${errors.city ? errorInputStyle : ''}`}
//                         onChange={(e) => {
//                           const value = e.target.value.replace(/[^a-zA-Z\s\-']/g, '');
//                           handleAddressChange('city', value);
//                         }}
//                         onBlur={() => {
//                           const error = validateCity(addrDetails.city);
//                           setErrors({ ...errors, city: error });
//                         }}
//                       />
//                       {errors.city && (
//                         <p className="text-red-500 text-xs mt-1 font-medium">
//                           {errors.city}
//                         </p>
//                       )}
//                     </div>

//                     {/* Postal Code */}
//                     <div>
//                       <input
//                         type="text"
//                         placeholder="Postal Code"
//                         value={addrDetails.pincode}
//                         className={`${inputStyle} ${errors.pincode ? errorInputStyle : ''}`}
//                         onChange={(e) => {
//                           // Allow letters for countries with alphanumeric postal codes
//                           const value = e.target.value;
//                           handleAddressChange('pincode', value);
//                         }}
//                         onBlur={() => {
//                           const error = validatePincode(addrDetails.pincode, addrDetails.country);
//                           setErrors({ ...errors, pincode: error });
//                         }}
//                       />
//                       {errors.pincode && (
//                         <p className="text-red-500 text-xs mt-1 font-medium">
//                           {errors.pincode}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Mobile & Gender */}
//               <div
//                 className={`grid ${
//                   isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
//                 }`}
//               >
//                 <div>
//                   <input
//                     type="tel"
//                     placeholder="Mobile No. (e.g., +44...)"
//                     value={formData.mobile}
//                     className={`${inputStyle} ${errors.mobile ? errorInputStyle : ''}`}
//                     onChange={(e) => {
//                       const formatted = formatMobileNumber(e.target.value);
//                       handleFieldChange('mobile', formatted);
//                     }}
//                     onBlur={() => {
//                       const error = validateMobile(formData.mobile, addrDetails.country);
//                       setErrors({ ...errors, mobile: error });
//                     }}
//                     inputMode="tel"
//                   />
//                   {errors.mobile && (
//                     <p className="text-red-500 text-xs mt-1 font-medium">
//                       {errors.mobile}
//                     </p>
//                   )}
//                   <p className="text-gray-400 text-xs mt-1">
//                     Include country code (e.g., +44 for UK)
//                   </p>
//                 </div>
//                 <div className="relative">
//                   <select
//                     value={formData.gender}
//                     onChange={(e) => handleFieldChange('gender', e.target.value)}
//                     onBlur={() => {
//                       const error = validateGender(formData.gender);
//                       setErrors({ ...errors, gender: error });
//                     }}
//                     className={`${inputStyle} pr-10 ${errors.gender ? errorInputStyle : ''}`}
//                   >
//                     <option value="" disabled>
//                       Gender
//                     </option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                     <option value="Prefer not to say">Prefer not to say</option>
//                   </select>
//                   {errors.gender && (
//                     <p className="text-red-500 text-xs mt-1 font-medium">
//                       {errors.gender}
//                     </p>
//                   )}
//                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                     <svg
//                       className="w-5 h-5 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Password Field */}
//           <div>
//             <input
//               type="password"
//               placeholder="Password"
//               value={formData.password}
//               required
//               autoComplete="new-password"
//               className={`${inputStyle} ${errors.password ? errorInputStyle : ''}`}
//               onChange={(e) => handleFieldChange('password', e.target.value)}
//               onBlur={() => {
//                 const error = validatePassword(formData.password);
//                 setErrors({ ...errors, password: error });
//               }}
//             />
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1 font-medium">
//                 {errors.password}
//               </p>
//             )}
//             <p className="text-gray-400 text-xs mt-1">
//               Min. 8 chars with uppercase, lowercase, number & special char
//             </p>
//           </div>

//           {/* Confirm Password Field */}
//           {!isLogin && (
//             <div>
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={formData.confirmPassword}
//                 required
//                 autoComplete="new-password"
//                 className={`${inputStyle} ${errors.confirmPassword ? errorInputStyle : ''}`}
//                 onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
//                 onBlur={() => {
//                   const error = validateConfirmPassword(
//                     formData.password, 
//                     formData.confirmPassword
//                   );
//                   setErrors({ ...errors, confirmPassword: error });
//                 }}
//               />
//               {errors.confirmPassword && (
//                 <p className="text-red-500 text-xs mt-1 font-medium">
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className={`
//               w-full bg-gradient-to-r from-[#1d275e] to-[#2f609b] 
//               text-white font-bold uppercase 
//               hover:shadow-lg hover:to-[#1d275e] 
//               active:scale-[0.98] transition-all duration-300 
//               rounded-lg
//               ${isMobile ? "py-4 text-base" : "py-4 text-base"}
//               mt-4
//               min-height: 48px
//               touch-action: manipulation
//               disabled:opacity-50 disabled:cursor-not-allowed
//             `}
//             disabled={Object.values(errors).some(error => error !== "")}
//           >
//             {isLogin ? "Secure Login" : "Create Account"}
//           </button>
//         </form>

//         {message && (
//           <div
//             className={`
//               mt-4 p-3 rounded-lg text-sm font-medium 
//               text-center border
//               ${
//                 message.toLowerCase().includes("success") ||
//                 message.toLowerCase().includes("created")
//                   ? "bg-green-50 text-green-700 border-green-200"
//                   : "bg-red-50 text-red-700 border-red-200"
//               }
//             `}
//           >
//             {message}
//           </div>
//         )}

//         <div
//           className={`
//           mt-6 text-center pt-4
//           border-t border-gray-100
//         `}
//         >
//           <p
//             className={`
//             text-gray-400 font-medium
//             ${isMobile ? "text-sm" : "text-sm"}
//           `}
//           >
//             {isLogin
//               ? "Don't have an account yet?"
//               : "Already have an account?"}
//           </p>
//           <button
//             className={`
//               text-[#2f609b] font-bold hover:text-[#1d275e] 
//               transition-colors mt-2 text-base
//               active:text-[#1d275e]
//             `}
//             onClick={switchMode}
//             type="button"
//           >
//             {isLogin ? "Register New Pharmacy" : "Login to Existing Account"}
//           </button>
//         </div>

//         {/* GDPR Data Protection Notice */}
//         <div className="mt-4 text-xs text-center text-gray-400">
//           By continuing, you agree to our{" "}
//           <a href="/terms" className="text-[#2f609b] underline">Terms</a>{" "}
//           and{" "}
//           <a href="/privacy" className="text-[#2f609b] underline">Privacy Policy</a>
//           <br />
//           Your data is processed in accordance with GDPR
//         </div>
//       </div>
//     </div>
//   );
// }