// app\components\LoginPopup.jsx
"use client";
import { useState, useEffect, useRef } from "react";

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
  const [mobileError, setMobileError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [cityError, setCityError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100vh");

  const abortControllerRef = useRef(null);
  const modalRef = useRef(null);

  // Check if mobile device and handle iOS viewport issues
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Fix for iOS viewport height issues
      const vh = window.innerHeight * 0.01;
      setViewportHeight(`${vh}px`);
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Prevent zoom on iOS inputs
  useEffect(() => {
    const handleViewportMeta = () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta && isMobile) {
        // Store original content
        const originalContent = viewportMeta.getAttribute('content');
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        
        return () => {
          viewportMeta.setAttribute('content', originalContent);
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
      
      // Prevent background scrolling on mobile
      if (isMobile) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => {
        clearTimeout(timer);
        // Restore scrolling
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
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
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex justify-center items-start sm:items-center 
        transition-all duration-300 ease-in-out px-4
        ${isOpen
          ? "bg-[#0f172a]/90 backdrop-blur-sm opacity-100"
          : "bg-transparent opacity-0 pointer-events-none"
        }
      `}
      style={{ 
        height: isMobile ? '100vh' : '100%',
        minHeight: isMobile ? '-webkit-fill-available' : '100%'
      }}
    >
      <div
        ref={modalRef}
        className={`
          bg-white w-full
          ${isMobile 
            ? 'max-w-full rounded-t-2xl rounded-b-none mt-12' 
            : 'max-w-[500px] rounded-2xl'
          }
          shadow-2xl relative flex flex-col 
          transition-all duration-300 ease-out
          transform overflow-y-auto
          ${isMobile ? 'p-6' : 'p-8'}
          ${isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
          }
        `}
        style={{
          maxHeight: isMobile ? `calc(${viewportHeight} * 90)` : 'calc(100vh - 4rem)',
          height: isMobile ? 'auto' : 'auto',
          minHeight: isMobile ? '60vh' : 'auto',
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
            onClose();
          }}
          className={`
            absolute ${isMobile ? 'top-4 right-4' : 'top-6 right-6'}
            text-gray-400 hover:text-[#2f609b] 
            transition-colors duration-200 
            ${isMobile ? 'text-2xl w-10 h-10' : 'text-xl w-12 h-12'}
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
          <h2 className={`
            font-extrabold tracking-tight text-transparent 
            bg-clip-text bg-gradient-to-r from-[#1d275e] to-[#2f609b]
            ${isMobile ? 'text-2xl mb-2' : 'text-3xl mb-3'}
          `}>
            {isLogin ? "Welcome Back" : "Join EdPharma"}
          </h2>
          <p className={`
            text-gray-400 font-medium uppercase tracking-wide
            ${isMobile ? 'text-xs' : 'text-sm'}
          `}>
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
            <div>
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

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              required
              className={inputStyle}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              inputMode="email"
            />
          </div>

          {!isLogin && (
            <>
              {/* Address Section */}
              <div className="pt-2 pb-1">
                <label className={`
                  block font-bold text-[#2f609b] 
                  uppercase tracking-wider mb-3
                  ${isMobile ? 'text-xs' : 'text-sm'}
                `}>
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
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
                    {/* City */}
                    <div>
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
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {cityError}
                        </p>
                      )}
                    </div>

                    {/* Pincode */}
                    <div>
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={addrDetails.pincode}
                        className={inputStyle}
                        inputMode="numeric"
                        pattern="[0-9]*"
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
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {pincodeError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile & Gender */}
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
                <div>
                  <input
                    type="tel"
                    placeholder="Mobile No."
                    value={formData.mobile}
                    className={inputStyle}
                    inputMode="tel"
                    pattern="[0-9]*"
                    maxLength={15}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/[^0-9]/.test(value)) {
                        setMobileError("This is not valid");
                      } else {
                        setMobileError("");
                      }
                      setFormData({
                        ...formData,
                        mobile: value.replace(/[^0-9]/g, ""),
                      });
                    }}
                  />
                  {mobileError && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {mobileError}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className={`${inputStyle} pr-10`}
                  >
                    <option value="" disabled>
                      Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
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
              className={inputStyle}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {!isLogin && (
            <div>
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
            className={`
              w-full bg-gradient-to-r from-[#1d275e] to-[#2f609b] 
              text-white font-bold uppercase 
              hover:shadow-lg hover:to-[#1d275e] 
              active:scale-[0.98] transition-all duration-300 
              rounded-lg
              ${isMobile ? 'py-4 text-base' : 'py-4 text-base'}
              mt-4
              min-height: 48px
              touch-action: manipulation
            `}
          >
            {isLogin ? "Secure Login" : "Create Account"}
          </button>
        </form>

        {message && (
          <div
            className={`
              mt-4 p-3 rounded-lg text-sm font-medium 
              text-center border
              ${message.toLowerCase().includes("success") ||
                message.toLowerCase().includes("created")
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
              }
            `}
          >
            {message}
          </div>
        )}

        <div className={`
          mt-6 text-center pt-4
          border-t border-gray-100
        `}>
          <p className={`
            text-gray-400 font-medium
            ${isMobile ? 'text-sm' : 'text-sm'}
          `}>
            {isLogin
              ? "Don't have an account yet?"
              : "Already have an account?"}
          </p>
          <button
            className={`
              text-[#2f609b] font-bold hover:text-[#1d275e] 
              transition-colors mt-2 text-base
              active:text-[#1d275e]
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












// //app\components\LoginPopup.jsx
// "use client";
// import { useState, useEffect, useRef } from "react";

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
//   });

//   const [message, setMessage] = useState("");
//   const [isVisible, setIsVisible] = useState(false);
//   const [mobileError, setMobileError] = useState("");
//   const [pincodeError, setPincodeError] = useState("");
//   const [cityError, setCityError] = useState("");
//   const [isMobile, setIsMobile] = useState(false);

//   const abortControllerRef = useRef(null);
//   const modalRef = useRef(null);

//   // Check if mobile device
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

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
//       setAddrDetails({ street: "", city: "", pincode: "" });
      
//       // Prevent background scrolling on mobile
//       if (isMobile) {
//         document.body.style.overflow = 'hidden';
//       }
//     } else {
//       const timer = setTimeout(() => setIsVisible(false), 300);
//       return () => {
//         clearTimeout(timer);
//         // Restore scrolling
//         document.body.style.overflow = '';
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
//       if (e.key === 'Escape' && isOpen) {
//         onClose();
//       }
//     };
    
//     window.addEventListener('keydown', handleEscape);
//     return () => window.removeEventListener('keydown', handleEscape);
//   }, [isOpen, onClose]);

//   // Handle click outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (modalRef.current && !modalRef.current.contains(e.target)) {
//         onClose();
//       }
//     };
    
//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.addEventListener('touchstart', handleClickOutside);
//     }
    
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('touchstart', handleClickOutside);
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
//     setAddrDetails({ street: "", city: "", pincode: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

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
//         const userObj = {
//           _id: data.user._id || data.user.id,
//           username:
//             data.user.username ||
//             data.user.name ||
//             data.user.fullName ||
//             data.user.email?.split("@")[0],
//           email: data.user.email,
//         };

//         localStorage.setItem("bio-user", JSON.stringify(userObj));
//         onLoginSuccess(userObj);
//         onClose();
//       } else {
//         setMessage("Account created! Please login.");
//         setIsLogin(true);
//       }

//     } catch (err) {
//       if (err.name === "AbortError") return;
//       setMessage("Server error. Please try again.");
//     }
//   };

//   // Responsive input styles
//   const inputStyle = `
//     w-full px-3 sm:px-4 py-2.5 sm:py-3 
//     bg-gray-50/50 border border-gray-200 
//     focus:bg-white text-gray-700 
//     text-sm sm:text-base
//     outline-none focus:border-[#2f609b] 
//     focus:ring-1 focus:ring-[#2f609b] 
//     transition-all rounded-none 
//     placeholder:text-gray-400
//     ${isMobile ? 'text-base' : ''}
//   `;

//   return (
//     <div
//     className={`
//       fixed inset-0 z-[9999] flex justify-center items-center 
//       transition-all duration-300 ease-in-out px-2 sm:px-4
//       ${isOpen
//         ? "bg-[#0f172a]/90 backdrop-blur-sm opacity-100"
//         : "bg-transparent opacity-0 pointer-events-none"
//       }
//     `}
//   >
//     <div
//       ref={modalRef}
//       className={`
//         bg-white w-full
//         ${isMobile ? 'max-w-[95%] h-auto max-h-[90vh]' : 'max-w-[500px]'}
//         rounded-sm shadow-2xl relative flex flex-col 
//         transition-all duration-300 ease-out
//         transform overflow-y-auto
//         ${isMobile ? 'p-4 sm:p-6' : 'p-6 sm:p-8'}
//         ${isOpen
//           ? "scale-100 translate-y-0 opacity-100"
//           : "scale-95 translate-y-4 opacity-0"
//         }
//       `}
//       style={{
//         maxHeight: isMobile ? 'calc(100vh - 2rem)' : 'calc(100vh - 4rem)',
//       }}
//     >
//       {/* Close Button - Mobile optimized */}
//       <button
//         onClick={() => {
//           if (abortControllerRef.current) {
//             abortControllerRef.current.abort();
//             abortControllerRef.current = null;
//           }
//           setMessage("");
//           setFormData({
//             username: "",
//             email: "",
//             gender: "",
//             mobile: "",
//             password: "",
//             confirmPassword: "",
//           });
//           setAddrDetails({ street: "", city: "", pincode: "" });
//           onClose();
//         }}
//         className={`
//           absolute top-2 right-2 sm:top-4 sm:right-4 
//           text-gray-400 hover:text-[#2f609b] 
//           transition-colors duration-200 
//           ${isMobile ? 'text-2xl p-1' : 'text-xl p-2'}
//           z-10
//         `}
//         aria-label="Close"
//       >
//         ✕
//       </button>


//         {/* Brand Header */}
//         <div className="text-center mb-6 sm:mb-8 mt-0 sm:mt-2 flex flex-col items-center justify-center">
//         <h2 className={`
//           font-extrabold tracking-tight text-transparent 
//           bg-clip-text bg-gradient-to-r from-[#1d275e] to-[#2f609b]
//           ${isMobile ? 'text-2xl' : 'text-3xl'}
//           ${isMobile ? 'leading-tight' : ''}
//         `}>
//           {isLogin ? "Welcome Back" : "Join EdPharma"}
//         </h2>
//         <p className={`
//           text-gray-400 font-medium mt-2 uppercase tracking-wide
//           ${isMobile ? 'text-xs mt-1' : 'text-xs sm:text-sm'}
//           ${isMobile ? 'px-2' : ''}
//         `}>
//           {isLogin
//             ? "Access your medical dashboard"
//             : "Create your secure account"}
//         </p>
//       </div>

//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col gap-3 sm:gap-4"
//           autoComplete="off"
//         >
//           {!isLogin && (
//             <div className="group">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={formData.username}
//                 required
//                 className={inputStyle}
//                 onChange={(e) =>
//                   setFormData({ ...formData, username: e.target.value })
//                 }
//               />
//             </div>
//           )}

//           <div className="group">
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={formData.email}
//               required
//               className={inputStyle}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//             />
//           </div>

//           {!isLogin && (
//             <>
//               {/* Address Section */}
//               <div className="pt-1 sm:pt-2 pb-0 sm:pb-1">
//                 <label className={`
//                   block font-bold text-[#2f609b] 
//                   uppercase tracking-wider mb-2 ml-1
//                   ${isMobile ? 'text-[9px]' : 'text-[10px]'}
//                 `}>
//                   Pharmacy Address
//                 </label>
//                 <div className="space-y-2 sm:space-y-3">
//                   <input
//                     type="text"
//                     placeholder="Street / Area / Building"
//                     value={addrDetails.street}
//                     className={inputStyle}
//                     onChange={(e) =>
//                       setAddrDetails({ ...addrDetails, street: e.target.value })
//                     }
//                   />
//                   <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-3'}`}>
//                     {/* City */}
//                     <div className="group">
//                       <input
//                         type="text"
//                         placeholder="City"
//                         value={addrDetails.city}
//                         className={inputStyle}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           if (value === "") {
//                             setCityError("");
//                           } else if (/[^a-zA-Z\s]/.test(value)) {
//                             setCityError("This is not valid");
//                           } else {
//                             setCityError("");
//                           }
//                           setAddrDetails({
//                             ...addrDetails,
//                             city: value.replace(/[^a-zA-Z\s]/g, ""),
//                           });
//                         }}
//                       />
//                       {cityError && (
//                         <p className="text-red-500 text-[10px] sm:text-[11px] mt-1 font-medium">
//                           {cityError}
//                         </p>
//                       )}
//                     </div>

//                     {/* Pincode */}
//                     <div className="group">
//                       <input
//                         type="text"
//                         placeholder="Pincode"
//                         value={addrDetails.pincode}
//                         className={inputStyle}
//                         inputMode="numeric"
//                         maxLength={6}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           if (value === "") {
//                             setPincodeError("");
//                           } else if (/[^0-9]/.test(value)) {
//                             setPincodeError("This is not valid");
//                           } else {
//                             setPincodeError("");
//                           }
//                           setAddrDetails({
//                             ...addrDetails,
//                             pincode: value.replace(/[^0-9]/g, ""),
//                           });
//                         }}
//                       />
//                       {pincodeError && (
//                         <p className="text-red-500 text-[10px] sm:text-[11px] mt-1 font-medium">
//                           {pincodeError}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Mobile & Gender */}
//               <div className={`${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-3'} grid`}>
//                 <div className="group">
//                   <input
//                     type="tel"
//                     placeholder="Mobile No."
//                     value={formData.mobile}
//                     className={inputStyle}
//                     inputMode="numeric"
//                     maxLength={15}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (/[^0-9]/.test(value)) {
//                         setMobileError("This is not valid");
//                       } else {
//                         setMobileError("");
//                       }
//                       setFormData({
//                         ...formData,
//                         mobile: value.replace(/[^0-9]/g, ""),
//                       });
//                     }}
//                   />
//                   {mobileError && (
//                     <p className="text-red-500 text-[10px] sm:text-[11px] mt-1 font-medium">
//                       {mobileError}
//                     </p>
//                   )}
//                 </div>
//                 <div className="group">
//                   <select
//                     value={formData.gender}
//                     onChange={(e) =>
//                       setFormData({ ...formData, gender: e.target.value })
//                     }
//                     className={`${inputStyle} appearance-none`}
//                   >
//                     <option value="" disabled>
//                       Gender
//                     </option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="group">
//             <input
//               type="password"
//               placeholder="Password"
//               value={formData.password}
//               required
//               autoComplete="new-password"
//               className={inputStyle}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//             />
//           </div>

//           {!isLogin && (
//             <div className="group">
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={formData.confirmPassword}
//                 required
//                 autoComplete="new-password"
//                 className={inputStyle}
//                 onChange={(e) =>
//                   setFormData({ ...formData, confirmPassword: e.target.value })
//                 }
//               />
//             </div>
//           )}

//           <button
//             type="submit"
//             className={`
//               w-full bg-gradient-to-r from-[#1d275e] to-[#2f609b] 
//               text-white font-bold tracking-widest uppercase 
//               hover:shadow-lg hover:to-[#1d275e] 
//               active:scale-[0.99] transition-all duration-300 
//               rounded-none
//               ${isMobile ? 'py-3 text-sm' : 'py-4 text-sm sm:text-base'}
//               mt-3 sm:mt-4
//             `}
//           >
//             {isLogin ? "Secure Login" : "Create Account"}
//           </button>
//         </form>

//         {message && (
//           <div
//             className={`
//               mt-3 sm:mt-4 p-3 rounded-none text-xs font-bold 
//               text-center border-l-4
//               ${message.toLowerCase().includes("success") ||
//                 message.toLowerCase().includes("created")
//                 ? "bg-green-50 text-green-700 border-green-500"
//                 : "bg-red-50 text-red-700 border-red-500"
//               }
//             `}
//           >
//             {message}
//           </div>
//         )}

//         <div className={`
//           mt-6 sm:mt-8 text-center pt-4 sm:pt-6 
//           border-t border-gray-100
//         `}>
//           <p className={`
//             text-gray-400 font-medium
//             ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}
//           `}>
//             {isLogin
//               ? "Don't have an account yet?"
//               : "Already have an account?"}
//           </p>
//           <button
//             className={`
//               text-[#2f609b] font-bold hover:text-[#1d275e] 
//               transition-colors mt-1 sm:mt-2 uppercase tracking-wide
//               ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}
//             `}
//             onClick={switchMode}
//             type="button"
//           >
//             {isLogin ? "Register New Pharmacy" : "Login to Existing Account"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }