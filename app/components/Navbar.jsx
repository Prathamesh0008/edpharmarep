"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Download, Search, LogOut, ChevronRight, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useCart } from "./CartContext";
import LoginPopup from "./LoginPopup";
import { products } from "@/app/data/products";

/* ================= NAVBAR ================= */

export default function Navbar() {
  const router = useRouter();
  const { cartItems, getCartBadgeCount } = useCart();
  const searchRef = useRef(null);
  const desktopSearchRef = useRef(null);

  /* ---------- STATES ---------- */
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [mounted, setMounted] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const cartCount = getCartBadgeCount();

  /* ---------- USER AUTH SYNC - FIXED ---------- */
  useEffect(() => {
    setMounted(true);
    
    // Function to load user from localStorage
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("bio-user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUsername(user.username || user.name || user.email || "User");
        } else {
          setUsername("");
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUsername("");
      }
    };

    // Load initial user
    loadUser();

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === "bio-user" || e.key === null) {
        loadUser();
      }
    };

    // Listen for custom storage events (same tab)
    const handleCustomStorageEvent = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bio-user-updated', handleCustomStorageEvent);
    
    // Also check periodically (for same tab updates)
    const interval = setInterval(loadUser, 500);
    
    // Listen for route changes
    const handleRouteChange = () => {
      loadUser();
    };
    
    router.events?.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bio-user-updated', handleCustomStorageEvent);
      clearInterval(interval);
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  /* ---------- CLICK OUTSIDE HANDLER ---------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close desktop search
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target)) {
        setShowDesktopSearch(false);
        setSuggestions([]);
      }
      // Close mobile search
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
      // Close profile menu
      if (profileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [profileMenuOpen]);

  /* ---------- HANDLERS ---------- */
  const handleLoginSuccess = (user) => {
    localStorage.setItem("bio-user", JSON.stringify(user));
    // Dispatch custom event to notify navbar
    window.dispatchEvent(new Event('bio-user-updated'));
    setUsername(user.username || user.name || user.email || "User");
    setIsPopupOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("bio-user");
    // Dispatch custom event
    window.dispatchEvent(new Event('bio-user-updated'));
    setUsername("");
    setProfileMenuOpen(false);
    router.push("/");
  };
  
  const handleSearchChange = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const results = products
      .filter((p) => {
        const q = value.toLowerCase().trim();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.composition?.toLowerCase().includes(q) ||
          p.strength?.toLowerCase().includes(q)
        );
      })
      .slice(0, 6);

    setSuggestions(results);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      performSearch();
    }
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      performSearch();
    }
  };

  const performSearch = () => {
    const searchQuery = query.trim();
    if (!searchQuery) return;

    // Close search interfaces
    setShowDesktopSearch(false);
    setMobileSearchOpen(false);
    setSuggestions([]);
    
    // Navigate to search results page
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const toggleDesktopSearch = () => {
    setShowDesktopSearch(!showDesktopSearch);
    if (!showDesktopSearch) {
      // Focus the input when opening
      setTimeout(() => {
        const input = desktopSearchRef.current?.querySelector('input');
        input?.focus();
      }, 10);
    } else {
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setQuery("");
    setSuggestions([]);
    setShowDesktopSearch(false);
    setMobileSearchOpen(false);
    
    if (item.slug) {
      router.push(`/product/${item.slug}`);
    } else if (item.id) {
      router.push(`/product/${item.id}`);
    } else if (item.name) {
      const slug = item.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      router.push(`/product/${slug}`);
    } else {
      router.push(`/products?search=${encodeURIComponent(item.name || query)}`);
    }
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    if (!mobileSearchOpen) {
      setTimeout(() => {
        const input = searchRef.current?.querySelector('input');
        input?.focus();
      }, 10);
    } else {
      setQuery("");
      setSuggestions([]);
    }
  };

  // Handle escape key for closing search
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowDesktopSearch(false);
        setMobileSearchOpen(false);
        setSuggestions([]);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <>
        <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-[1000] h-[60px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
            {/* Logo placeholder */}
            <Link href="/" className="flex items-center">
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </Link>
            {/* Desktop menu placeholder */}
            <div className="hidden md:flex items-center gap-4">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </nav>
        <div className="h-[64px]" />
      </>
    );
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-[1000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <img
              src="/EdLogo.svg"
              alt="ED Pharma"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-6 text-slate-700 font-medium">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/terms">Terms</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/orders">My Orders</NavLink>

            {/* ================= DESKTOP SEARCH ================= */}
            <div className="flex items-center gap-4">
              <div ref={desktopSearchRef} className="relative">
                {/* SEARCH ICON BUTTON */}
                <button
                  onClick={toggleDesktopSearch}
                  className="text-blue-700 hover:text-blue-800 transition p-2 rounded-full hover:bg-blue-50"
                  title="Search products"
                >
                  <Search size={22} />
                </button>

                {/* EXPANDABLE SEARCH BAR */}
                {showDesktopSearch && (
                  <div className="absolute right-0 top-0 mt-12 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 w-96 z-50">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search medicines, products, brands..."
                          value={query}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          onKeyDown={handleSearch}
                          className="w-full border border-gray-300 rounded-xl pl-11 pr-10 py-2.5 text-sm
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                            transition-all duration-200"
                        />
                        {query && (
                          <button
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
                              p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={handleSearchSubmit}
                        disabled={!query.trim()}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl 
                          hover:from-blue-700 hover:to-blue-800 transition-all duration-200 
                          disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                          flex items-center justify-center shadow-md hover:shadow-lg"
                      >
                        <Search size={18} />
                      </button>
                    </div>

                    {/* SEARCH SUGGESTIONS */}
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-50 max-h-80 overflow-y-auto">
                        <div className="p-2">
                          <p className="text-xs text-gray-500 font-medium px-2 py-1">Search Results</p>
                          {suggestions.map((item) => (
                            <button
                              key={item.id || item.name}
                              onClick={() => handleSuggestionClick(item)}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 rounded-lg 
                                flex items-center justify-between border-b last:border-b-0 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">{item.name}</div>
                                <div className="text-xs text-gray-500 truncate">
                                  {item.strength || item.brand || item.composition || ''}
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ✅ DOWNLOAD PDF BUTTON */}
              <a
                href="/ED.pdf"
                download
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-700 rounded-full 
                  hover:bg-blue-50 transition-all duration-200 hover:shadow-sm font-medium text-sm"
              >
                <Download size={16} />
                Download PDF
              </a>

              {/* CART */}
              <button
                onClick={() => router.push("/cart")}
                className="relative text-2xl hover:scale-105 transition-transform p-1"
                title="Cart"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold 
                    rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* LOGIN / PROFILE - FIXED */}
              {username ? (
                <div className="relative profile-menu-container">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 
                      text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-200
                      hover:shadow-sm min-w-[120px] justify-center"
                  >
                    <User size={16} />
                    Hi, {username.length > 8 ? `${username.substring(0, 8)}...` : username}
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-[999] 
                      overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <p className="font-semibold text-gray-900 text-sm">{username}</p>
                        <p className="text-xs text-gray-500 truncate">Welcome back!</p>
                      </div>
                      
                      <Link
                        href="/orders"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 
                          transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <PackageIcon />
                        </div>
                        <span>My Orders</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 
                          transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <User size={14} />
                        </div>
                        <span>My Profile</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 
                          hover:bg-red-50 transition-colors"
                      >
                        <div className="p-1.5 bg-red-100 rounded-lg">
                          <LogOut size={14} />
                        </div>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors
                    px-4 py-2 rounded-full hover:bg-blue-50 border border-transparent hover:border-blue-200"
                >
                  Log In
                </button>
              )}
            </div>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="flex items-center gap-3 md:hidden">
            {/* MOBILE SEARCH TOGGLE */}
            {!mobileSearchOpen && (
              <button
                onClick={toggleMobileSearch}
                className="text-blue-700 hover:text-blue-800 transition p-2 rounded-full hover:bg-blue-50"
              >
                <Search size={24} />
              </button>
            )}

            {/* CART - MOBILE */}
            <button
              onClick={() => router.push("/cart")}
              className="relative text-2xl text-blue-700 hover:text-blue-800 transition p-1"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold 
                  rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* MENU TOGGLE */}
            {!mobileSearchOpen && (
              <button 
                onClick={() => setMenuOpen(true)} 
                className="text-blue-700 hover:text-blue-800 transition p-2 rounded-full hover:bg-blue-50"
              >
                <Menu size={28} />
              </button>
            )}

            {/* MOBILE SEARCH BAR */}
            {mobileSearchOpen && (
              <div ref={searchRef} className="absolute top-0 left-0 right-0 h-[60px] bg-white px-4 
                flex items-center gap-2 z-[1001] shadow-md">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-10 py-2.5 text-sm
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  disabled={!query.trim()}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 
                    transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed
                    flex items-center justify-center"
                >
                  <Search size={18} />
                </button>
                <button
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setQuery("");
                    setSuggestions([]);
                  }}
                  className="text-blue-700 hover:text-blue-800 p-1"
                >
                  <X size={24} />
                </button>

                {/* MOBILE SEARCH SUGGESTIONS */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 
                    rounded-xl shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((item) => (
                      <button
                        key={item.id || item.name}
                        onClick={() => handleSuggestionClick(item)}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 
                          flex items-center justify-between border-b last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{item.name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {item.strength || item.brand || ''}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 z-[999] backdrop-blur-sm"
          />

          <div className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[1001] shadow-2xl 
            flex flex-col">
            {/* DRAWER HEADER */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    {username ? (
                      <>
                        <p className="font-semibold text-gray-900">
                          Hi, {username.length > 12 ? `${username.substring(0, 12)}...` : username}
                        </p>
                        <p className="text-xs text-gray-500">Welcome!</p>
                      </>
                    ) : (
                      <p className="font-semibold text-gray-900">Guest User</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* DRAWER CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 space-y-1">
              <MobileLink href="/" onClick={() => setMenuOpen(false)}>
                Home
              </MobileLink>
              <MobileLink href="/products" onClick={() => setMenuOpen(false)}>
                Products
              </MobileLink>
              <MobileLink href="/about" onClick={() => setMenuOpen(false)}>
                About Us
              </MobileLink>
              <MobileLink href="/terms" onClick={() => setMenuOpen(false)}>
                Terms & Conditions
              </MobileLink>
              <MobileLink href="/contact" onClick={() => setMenuOpen(false)}>
                Contact Us
              </MobileLink>
              <MobileLink href="/orders" onClick={() => setMenuOpen(false)}>
                My Orders
              </MobileLink>

              {/* DOWNLOAD PDF - MOBILE */}
              <a
                href="/ED.pdf"
                download
                className="flex items-center gap-3 px-4 py-3 text-blue-700 font-semibold 
                  hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Download size={20} />
                Download PDF
              </a>

              {/* USER ACTIONS */}
              {username ? (
                <>
                  <MobileLink href="/profile" onClick={() => setMenuOpen(false)}>
                    My Profile
                  </MobileLink>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 font-semibold 
                      hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setIsPopupOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-blue-600 font-semibold 
                    hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors w-full text-left"
                >
                  <User size={20} />
                  Login / Register
                </button>
              )}
            </div>

            {/* DRAWER FOOTER */}
            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} ED Pharma. All rights reserved.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-[64px]" />

      {/* ================= LOGIN MODAL ================= */}
      <LoginPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

/* ================= HELPERS ================= */

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors
        after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-600 after:to-blue-400
        after:transition-all hover:after:w-full after:rounded-full"
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 text-base font-semibold text-gray-900 
        hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
    >
      {children}
    </Link>
  );
}

function PackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15"/>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  );
}