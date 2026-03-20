"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation"; // Add usePathname
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPopup({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialMode = "login" // Add this prop with default value "login"
}) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
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
  const pathname = usePathname(); // Get current path
  const { login } = useAuth();
  const abortControllerRef = useRef(null);
  const modalRef = useRef(null);

  // Admin credentials from environment variables
  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@edpharma.com";
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin@123";

  // Check if we're on the cart page
  const isCartPage = pathname === "/cart";

  // Validation functions (removed Gmail validation)
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
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
    // const firstDigit = mobile.charAt(0);
    // if (!['6', '7', '8', '9'].includes(firstDigit)) {
    //   return "Mobile number must start with 6, 7, 8, or 9";
    // }
    
    return "";
  };

  const validatePincode = (pincode) => {
    if (!pincode) return "Zipcode is required";
    
    // Must be exactly 6 digits
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(pincode)) {
      return "Zipcode must be exactly 6 digits and cannot start with 0";
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

  // Animation logic - MODIFIED to reset to login mode when opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsLogin(initialMode === "login"); // Reset to login mode based on prop
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
  }, [isOpen, initialMode, isMobile]);

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

  if (!isOpen && !isVisible) return null;

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

        // UPDATED: Redirect based on source page
        if (isCartPage) {
          // If coming from cart page, stay on cart page
          router.push("/cart");
        } else {
          // If coming from navbar or any other page, go to home page
          router.push("/");
        }
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
            {isLogin ? "Welcome Back" : " EdPharma"}
          </h2>
          <p
            className={`
            text-gray-400 font-medium uppercase tracking-wide
            ${isMobile ? "text-xs" : "text-sm"}
          `}
          >
            {isLogin
              ? ""
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
              placeholder="Email Address"
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
                        placeholder="Zipcode"
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
                    placeholder="Mobile No "
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
            {isLogin ? "Register New User" : "Login to Existing Account"}
          </button>
        </div>
      </div>
    </div>
  );
}


// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/AuthContext";

// export default function LoginPopup({ 
//   isOpen, 
//   onClose, 
//   onLoginSuccess,
//   initialMode = "login" // Add this prop with default value "login"
// }) {
//   const [isLogin, setIsLogin] = useState(initialMode === "login");
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
//   });

//   const [message, setMessage] = useState("");
//   const [isVisible, setIsVisible] = useState(false);
  
//   // Validation error states
//   const [errors, setErrors] = useState({
//     username: "",
//     email: "",
//     gender: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//     street: "",
//     city: "",
//     pincode: "",
//   });

//   const [mobileError, setMobileError] = useState("");
//   const [pincodeError, setPincodeError] = useState("");
//   const [cityError, setCityError] = useState("");
//   const [isMobile, setIsMobile] = useState(false);
//   const [viewportHeight, setViewportHeight] = useState("100vh");

//   const router = useRouter();
//   const { login } = useAuth();
//   const abortControllerRef = useRef(null);
//   const modalRef = useRef(null);

//   // Admin credentials from environment variables
//   const ADMIN_EMAIL =
//     process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@edpharma.com";
//   const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin@123";

//   // Validation functions
//   const validateEmail = (email) => {
//     if (!email) return "Email is required";
    
//     // Check if it's admin email (allow exact match)
//     if (email === ADMIN_EMAIL) return "";
    
//     // Gmail validation - must end with @gmail.com
//     const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
//     if (!gmailRegex.test(email)) {
//       return "Only Gmail addresses are allowed (must end with @gmail.com)";
//     }
    
//     // Additional check for valid Gmail format
//     const localPart = email.split('@')[0];
//     if (localPart.length < 6) {
//       return "Gmail username must be at least 6 characters";
//     }
//     if (localPart.length > 30) {
//       return "Gmail username is too long";
//     }
//     if (/[^a-zA-Z0-9._%+-]/.test(localPart)) {
//       return "Gmail username contains invalid characters";
//     }
    
//     return "";
//   };

//   const validateUsername = (username) => {
//     if (!username) return "Username is required";
    
//     // Allow letters, spaces, dots, hyphens, apostrophes for names
//     const nameRegex = /^[a-zA-Z\s.'-]+$/;
//     if (!nameRegex.test(username)) {
//       return "Username can only contain letters, spaces, dots, hyphens, and apostrophes";
//     }
    
//     // Check minimum length (after trimming)
//     const trimmed = username.trim();
//     if (trimmed.length < 2) {
//       return "Username must be at least 2 characters";
//     }
//     if (trimmed.length > 50) {
//       return "Username is too long";
//     }
    
//     return "";
//   };

//   const validatePassword = (password) => {
//     if (!password) return "Password is required";
    
//     if (password.length < 8) {
//       return "Password must be at least 8 characters long";
//     }
    
//     // Check for at least one uppercase letter
//     if (!/[A-Z]/.test(password)) {
//       return "Password must contain at least one uppercase letter";
//     }
    
//     // Check for at least one lowercase letter
//     if (!/[a-z]/.test(password)) {
//       return "Password must contain at least one lowercase letter";
//     }
    
//     // Check for at least one number
//     if (!/[0-9]/.test(password)) {
//       return "Password must contain at least one number";
//     }
    
//     // Check for at least one special character
//     if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
//       return "Password must contain at least one special character";
//     }
    
//     return "";
//   };

//   const validateMobile = (mobile) => {
//     if (!mobile) return "Mobile number is required";
    
//     // Must be exactly 10 digits
//     const mobileRegex = /^[0-9]{10}$/;
//     if (!mobileRegex.test(mobile)) {
//       return "Mobile number must be exactly 10 digits";
//     }
    
//     // Check if starts with valid Indian mobile prefixes (6-9)
//     const firstDigit = mobile.charAt(0);
//     if (!['6', '7', '8', '9'].includes(firstDigit)) {
//       return "Mobile number must start with 6, 7, 8, or 9";
//     }
    
//     return "";
//   };

//   const validatePincode = (pincode) => {
//     if (!pincode) return "Pincode is required";
    
//     // Must be exactly 6 digits
//     const pincodeRegex = /^[1-9][0-9]{5}$/;
//     if (!pincodeRegex.test(pincode)) {
//       return "Pincode must be exactly 6 digits and cannot start with 0";
//     }
    
//     return "";
//   };

//   const validateCity = (city) => {
//     if (!city) return "City is required";
    
//     // Allow only letters and spaces
//     const cityRegex = /^[a-zA-Z\s]+$/;
//     if (!cityRegex.test(city)) {
//       return "City can only contain letters and spaces";
//     }
    
//     if (city.trim().length < 2) {
//       return "City name must be at least 2 characters";
//     }
    
//     return "";
//   };

//   const validateStreet = (street) => {
//     if (!street) return "Street address is required";
    
//     // Allow letters, numbers, spaces, commas, periods, hyphens, slashes
//     const streetRegex = /^[a-zA-Z0-9\s,./-]+$/;
//     if (!streetRegex.test(street)) {
//       return "Street address contains invalid characters";
//     }
    
//     if (street.trim().length < 5) {
//       return "Street address must be at least 5 characters";
//     }
    
//     return "";
//   };

//   const validateGender = (gender) => {
//     if (!gender) return "Please select a gender";
//     return "";
//   };

//   const validateConfirmPassword = (password, confirmPassword) => {
//     if (!confirmPassword) return "Please confirm your password";
//     if (password !== confirmPassword) return "Passwords do not match";
//     return "";
//   };

//   // Real-time validation handlers
//   const handleUsernameChange = (value) => {
//     setFormData({ ...formData, username: value });
//     setErrors({ ...errors, username: validateUsername(value) });
//   };

//   const handleEmailChange = (value) => {
//     setFormData({ ...formData, email: value });
//     setErrors({ ...errors, email: validateEmail(value) });
//   };

//   const handleMobileChange = (value) => {
//     const numericValue = value.replace(/[^0-9]/g, "");
//     if (numericValue.length <= 10) {
//       setFormData({ ...formData, mobile: numericValue });
//       setErrors({ ...errors, mobile: validateMobile(numericValue) });
//     }
//   };

//   const handlePasswordChange = (value) => {
//     setFormData({ ...formData, password: value });
//     setErrors({ ...errors, password: validatePassword(value) });
    
//     // Also validate confirm password if it exists
//     if (formData.confirmPassword) {
//       setErrors({
//         ...errors,
//         confirmPassword: validateConfirmPassword(value, formData.confirmPassword),
//         password: validatePassword(value)
//       });
//     }
//   };

//   const handleConfirmPasswordChange = (value) => {
//     setFormData({ ...formData, confirmPassword: value });
//     setErrors({
//       ...errors,
//       confirmPassword: validateConfirmPassword(formData.password, value)
//     });
//   };

//   const handleCityChange = (value) => {
//     const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
//     setAddrDetails({ ...addrDetails, city: lettersOnly });
//     setErrors({ ...errors, city: validateCity(lettersOnly) });
//   };

//   const handlePincodeChange = (value) => {
//     const numericValue = value.replace(/[^0-9]/g, "");
//     if (numericValue.length <= 6) {
//       setAddrDetails({ ...addrDetails, pincode: numericValue });
//       setErrors({ ...errors, pincode: validatePincode(numericValue) });
//     }
//   };

//   const handleStreetChange = (value) => {
//     setAddrDetails({ ...addrDetails, street: value });
//     setErrors({ ...errors, street: validateStreet(value) });
//   };

//   const handleGenderChange = (value) => {
//     setFormData({ ...formData, gender: value });
//     setErrors({ ...errors, gender: validateGender(value) });
//   };

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
//         // Store original content
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

//   // Animation logic - MODIFIED to reset to login mode when opened
//   useEffect(() => {
//     if (isOpen) {
//       setIsVisible(true);
//       setIsLogin(initialMode === "login"); // Reset to login mode based on prop
//       setMessage("");
//       setFormData({
//         username: "",
//         email: "",
//         gender: "",
//         mobile: "",
//         password: "",
//         confirmPassword: "",
//       });
//       setAddrDetails({ street: "", city: "", pincode: "" });
//       setErrors({
//         username: "",
//         email: "",
//         gender: "",
//         mobile: "",
//         password: "",
//         confirmPassword: "",
//         street: "",
//         city: "",
//         pincode: "",
//       });

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
//   }, [isOpen, initialMode, isMobile]);

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

//   if (!isOpen && !isVisible) return null;

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
//     setAddrDetails({ street: "", city: "", pincode: "" });
//     setErrors({
//       username: "",
//       email: "",
//       gender: "",
//       mobile: "",
//       password: "",
//       confirmPassword: "",
//       street: "",
//       city: "",
//       pincode: "",
//     });
//   };

//   // Simple login function for localStorage
//   const loginUser = (userData) => {
//     localStorage.setItem("bio-user", JSON.stringify(userData));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate all fields before submission
//     let hasErrors = false;
//     const newErrors = { ...errors };

//     if (!isLogin) {
//       // Registration validation
//       newErrors.username = validateUsername(formData.username);
//       newErrors.email = validateEmail(formData.email);
//       newErrors.mobile = validateMobile(formData.mobile);
//       newErrors.gender = validateGender(formData.gender);
//       newErrors.password = validatePassword(formData.password);
//       newErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
//       newErrors.street = validateStreet(addrDetails.street);
//       newErrors.city = validateCity(addrDetails.city);
//       newErrors.pincode = validatePincode(addrDetails.pincode);

//       hasErrors = Object.values(newErrors).some(error => error !== "");
//     } else {
//       // Login validation
//       newErrors.email = validateEmail(formData.email);
//       newErrors.password = validatePassword(formData.password);
      
//       hasErrors = newErrors.email !== "" || newErrors.password !== "";
//     }

//     setErrors(newErrors);

//     if (hasErrors) {
//       setMessage("Please fix all errors before submitting");
//       return;
//     }

//     console.log("🔍 LoginPopup: Form submitted");
//     console.log("🔍 LoginPopup: Email entered:", formData.email);
//     console.log("🔍 LoginPopup: Password entered:", formData.password);

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
//     font-size: 16px /* Prevents iOS zoom */
//   `;

//   const errorInputStyle = `
//     ${inputStyle}
//     border-red-300 focus:border-red-500 focus:ring-red-200
//     bg-red-50
//   `;

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
//             setAddrDetails({ street: "", city: "", pincode: "" });
//             setErrors({
//               username: "",
//               email: "",
//               gender: "",
//               mobile: "",
//               password: "",
//               confirmPassword: "",
//               street: "",
//               city: "",
//               pincode: "",
//             });
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
//             {isLogin ? "Welcome Back" : " EdPharma"}
//           </h2>
//           <p
//             className={`
//             text-gray-400 font-medium uppercase tracking-wide
//             ${isMobile ? "text-xs" : "text-sm"}
//           `}
//           >
//             {isLogin
//               ? ""
//               : "Create your secure account"}
//           </p>

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
//           {!isLogin && (
//             <div>
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={formData.username}
//                 required
//                 className={errors.username ? errorInputStyle : inputStyle}
//                 onChange={(e) => handleUsernameChange(e.target.value)}
//               />
//               {errors.username && (
//                 <p className="text-red-500 text-xs mt-1 font-medium">
//                   {errors.username}
//                 </p>
//               )}
//             </div>
//           )}

//           <div>
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={formData.email}
//               required
//               className={errors.email ? errorInputStyle : inputStyle}
//               onChange={(e) => handleEmailChange(e.target.value)}
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
//                   Pharmacy Address
//                 </label>
//                 <div className="space-y-3">
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Street / Area / Building"
//                       value={addrDetails.street}
//                       className={errors.street ? errorInputStyle : inputStyle}
//                       onChange={(e) => handleStreetChange(e.target.value)}
//                     />
//                     {errors.street && (
//                       <p className="text-red-500 text-xs mt-1 font-medium">
//                         {errors.street}
//                       </p>
//                     )}
//                   </div>
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
//                         className={errors.city ? errorInputStyle : inputStyle}
//                         onChange={(e) => handleCityChange(e.target.value)}
//                       />
//                       {errors.city && (
//                         <p className="text-red-500 text-xs mt-1 font-medium">
//                           {errors.city}
//                         </p>
//                       )}
//                     </div>

//                     {/* Pincode */}
//                     <div>
//                       <input
//                         type="text"
//                         placeholder="Pincode"
//                         value={addrDetails.pincode}
//                         className={errors.pincode ? errorInputStyle : inputStyle}
//                         inputMode="numeric"
//                         pattern="[0-9]*"
//                         maxLength={6}
//                         onChange={(e) => handlePincodeChange(e.target.value)}
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
//                     placeholder="Mobile No. (10 digits)"
//                     value={formData.mobile}
//                     className={errors.mobile ? errorInputStyle : inputStyle}
//                     inputMode="numeric"
//                     pattern="[0-9]*"
//                     maxLength={10}
//                     onChange={(e) => handleMobileChange(e.target.value)}
//                   />
//                   {errors.mobile && (
//                     <p className="text-red-500 text-xs mt-1 font-medium">
//                       {errors.mobile}
//                     </p>
//                   )}
//                 </div>
//                 <div className="relative">
//                   <select
//                     value={formData.gender}
//                     onChange={(e) => handleGenderChange(e.target.value)}
//                     className={errors.gender ? errorInputStyle : inputStyle}
//                   >
//                     <option value="" disabled>
//                       Gender
//                     </option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
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
//                   {errors.gender && (
//                     <p className="text-red-500 text-xs mt-1 font-medium">
//                       {errors.gender}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}

//           <div>
//             <input
//               type="password"
//               placeholder="Password"
//               value={formData.password}
//               required
//               autoComplete="new-password"
//               className={errors.password ? errorInputStyle : inputStyle}
//               onChange={(e) => handlePasswordChange(e.target.value)}
//             />
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1 font-medium">
//                 {errors.password}
//               </p>
//             )}
//           </div>

//           {!isLogin && (
//             <div>
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={formData.confirmPassword}
//                 required
//                 autoComplete="new-password"
//                 className={errors.confirmPassword ? errorInputStyle : inputStyle}
//                 onChange={(e) => handleConfirmPasswordChange(e.target.value)}
//               />
//               {errors.confirmPassword && (
//                 <p className="text-red-500 text-xs mt-1 font-medium">
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>
//           )}

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
//               cursor-pointer
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
//               cursor-pointer
//             `}
//             onClick={switchMode}
//             type="button"
//           >
//             {isLogin ? "Register New User" : "Login to Existing Account"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



