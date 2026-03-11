

// app/checkout/CheckoutClient.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { getLoggedInUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";
import LoginPopup from "../components/LoginPopup";

import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Package,
  CheckCircle,
  Save,
  Clock,
  X,
  ShoppingCart,
  Landmark,
  Bitcoin,
  FileText,
} from "lucide-react";

// Function to get user-specific address key
const getUserAddressKey = (userId) => {
  return `user_addresses_${userId}`;
};

// Function to save address to localStorage (user-specific)
const saveAddressToUser = (form, userId) => {
  if (!userId) return;

  try {
    const key = getUserAddressKey(userId);
    const addresses = getUserAddresses(userId);

    // Check if address already exists
    const existingIndex = addresses.findIndex(
      (addr) =>
        addr.fullName === form.fullName &&
        addr.phone === form.phone &&
        addr.address === form.address &&
        addr.pincode === form.pincode
    );

    // If it's a new address, add it (limit to 3 addresses)
    if (existingIndex === -1) {
      addresses.unshift(form);
      // Keep only last 3 addresses
      const limitedAddresses = addresses.slice(0, 3);
      localStorage.setItem(key, JSON.stringify(limitedAddresses));
    }
  } catch (error) {
    console.error("Error saving address to localStorage:", error);
  }
};

// Function to get saved addresses for a specific user
const getUserAddresses = (userId) => {
  if (!userId) return [];

  try {
    const key = getUserAddressKey(userId);
    const addressesStr = localStorage.getItem(key);
    return addressesStr ? JSON.parse(addressesStr) : [];
  } catch (error) {
    console.error("Error getting addresses from localStorage:", error);
    return [];
  }
};

// Function to delete a saved address for a specific user
const deleteUserAddress = (userId, index) => {
  if (!userId) return [];

  try {
    const key = getUserAddressKey(userId);
    const addresses = getUserAddresses(userId);
    const newAddresses = addresses.filter((_, i) => i !== index);
    localStorage.setItem(key, JSON.stringify(newAddresses));
    return newAddresses;
  } catch (error) {
    console.error("Error deleting address:", error);
    return [];
  }
};

export default function CheckoutClient() {
  const router = useRouter();
  const { cartItems, totals, clearCart } = useCart();
  const { t, language } = useLanguage();
  
  const [payment, setPayment] = useState("card");
  const [orderNotes, setOrderNotes] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressList, setShowAddressList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    country: "India",
  });

  // Get translations from context with fallbacks
  const checkoutTranslations = t?.checkoutPage || {
    header: {
      title: "Secure Checkout",
      subtitle: "Fast • Safe • Confidential",
      steps: ["Cart", "Address", "Payment", "Confirm"]
    },
    emptyState: {
      title: "Your cart is empty",
      description: "Add products to continue checkout.",
      browseButton: "Browse products"
    },
    deliveryAddress: {
      title: "Delivery Address",
      savedAddresses: "Your Saved Addresses",
      show: "Show",
      hide: "Hide",
      useAddress: "Use",
      saveAddress: "Save Address",
      note: "Addresses are saved only for your account and won't be visible to other users.",
      saveForFuture: "Save this address for future orders"
    },
    form: {
      placeholders: {
        fullName: "Full Name",
        phone: "Phone Number",
        email: "Email Address",
        address: "Full Address",
        city: "City",
        pincode: "Pincode",
        country: "Country"
      }
    },
    payment: {
      title: "Payment Method",
      card: {
        title: "Credit / Debit Card",
        subtitle: "Visa • Mastercard • RuPay"
      },
      bank: {
        title: "Bank Transfer",
        subtitle: "Net Banking • UPI • IMPS"
      },
      crypto: {
        title: "Cryptocurrency",
        subtitle: "BTC • ETH • USDT"
      },
      secure: "All payments are encrypted & secure",
      notes: {
        label: "Order Notes (Optional)",
        placeholder: "Add any special instructions or notes for your order..."
      }
    },
    orderSummary: {
      title: "Order Summary",
      secure: "Secure & Private",
      items: "Items",
      totalUnits: "Total Units",
      totalBatches: "Total Batches",
      totalAmount: "Total amount",
      placeOrder: "Place Secure Order",
      processing: "Processing...",
      trustedBy: "Trusted by healthcare professionals • Discreet packaging",
      continueShopping: "Continue shopping"
    },
    validation: {
      emptyCart: "Your cart is empty",
      fullName: {
        required: "Please enter a valid full name",
        invalid: "Full name must contain only alphabets"
      },
      email: "Please enter a valid email address",
      phone: "Phone number must be 10 digits",
      address: "Please enter full delivery address",
      city: "City is required",
      pincode: "Pincode must be 6 digits",
      country: "Country is required",
      payment: "Please select a payment method"
    },
    messages: {
      loginRequired: "Please login to continue checkout",
      saveSuccess: "Address saved successfully!",
      sessionExpired: "Session expired. Please login again.",
      orderFailed: "Order failed",
      networkError: "Network error. Please try again."
    }
  };

  const validateForm = (form, cartItems, payment) => {
    if (cartItems.length === 0) return checkoutTranslations.validation.emptyCart;

    if (!form.fullName || form.fullName.length < 3)
      return checkoutTranslations.validation.fullName.required;

    if (!/^[A-Za-z ]+$/.test(form.fullName.trim()))
      return checkoutTranslations.validation.fullName.invalid;

    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      return checkoutTranslations.validation.email;

    if (!form.phone || !/^\d{10}$/.test(form.phone))
      return checkoutTranslations.validation.phone;

    if (!form.address || form.address.length < 10)
      return checkoutTranslations.validation.address;

    if (!form.city) return checkoutTranslations.validation.city;

    if (!form.pincode || !/^\d{6}$/.test(form.pincode))
      return checkoutTranslations.validation.pincode;

    if (!form.country) return checkoutTranslations.validation.country;

    if (!payment) return checkoutTranslations.validation.payment;

    return null;
  };

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if cart is empty
        if (cartItems.length === 0) {
          setIsLoading(false);
          return;
        }

        // Get current logged in user
        const user = await getLoggedInUser();

        if (!user || !user._id) {
          // User is not logged in - show login popup
          setShowLoginPopup(true);
          setIsLoading(false);
          return;
        }

        console.log("Current user:", user);
        setCurrentUser(user);

        // Load user-specific addresses
        const addresses = getUserAddresses(user._id);
        setSavedAddresses(addresses);

        // If there are saved addresses, pre-fill with the most recent one
        if (addresses.length > 0) {
          setForm(addresses[0]);
          setShowAddressList(true);
        }
      } catch (error) {
        console.error("Error loading user/addresses:", error);
        setShowLoginPopup(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, cartItems.length]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowLoginPopup(false);
    
    // Reload addresses for the new user
    const addresses = getUserAddresses(user._id);
    setSavedAddresses(addresses);
    
    if (addresses.length > 0) {
      setForm(addresses[0]);
      setShowAddressList(true);
    }
  };

  const handleLoginPopupClose = () => {
    setShowLoginPopup(false);
    // If user closes popup without logging in, redirect to cart
    router.push("/cart");
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-[#edf3ff] to-[#e6eeff] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#0A4C89] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
              <ShoppingCart size={28} />
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
              {checkoutTranslations.emptyState.title}
            </h1>
            <p className="text-sm md:text-base text-gray-500 mb-6">
              {checkoutTranslations.emptyState.description}
            </p>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0A4C89] to-[#0D5FA8] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition-transform"
            >
              {checkoutTranslations.emptyState.browseButton}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const onChange = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const onNameChange = (e) => {
    const cleaned = e.target.value.replace(/[^A-Za-z ]/g, "");
    setForm((p) => ({ ...p, fullName: cleaned }));
  };

  const onPhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((p) => ({ ...p, phone: cleaned }));
  };

  const onPincodeChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6);
    setForm((p) => ({ ...p, pincode: cleaned }));
  };

  const onEmailChange = (e) => {
    const cleaned = e.target.value.replace(/\s/g, "").toLowerCase();
    setForm((p) => ({ ...p, email: cleaned }));
  };

  const onCityChange = (e) => {
    const cleaned = e.target.value.replace(/[^A-Za-z ]/g, "");
    setForm((p) => ({ ...p, city: cleaned }));
  };

  // Function to load a saved address
  const loadSavedAddress = (address) => {
    setForm(address);
    setShowAddressList(false);
  };

  // Function to delete a saved address
  const handleDeleteAddress = (index) => {
    if (!currentUser?._id) return;

    const newAddresses = deleteUserAddress(currentUser._id, index);
    setSavedAddresses(newAddresses);

    // If we deleted the current address, clear the form
    if (JSON.stringify(form) === JSON.stringify(savedAddresses[index])) {
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        country: "India",
      });
    }
  };

  // Function to save current address
  const handleSaveAddress = () => {
    if (!currentUser?._id) {
      setShowLoginPopup(true);
      return;
    }

    saveAddressToUser(form, currentUser._id);

    // Refresh addresses list
    const updatedAddresses = getUserAddresses(currentUser._id);
    setSavedAddresses(updatedAddresses);

    // Show success message
    alert(checkoutTranslations.messages.saveSuccess);
  };

  const placeOrder = async () => {
    try {
      // Check authentication again before placing order
      if (!currentUser || !currentUser._id) {
        setShowLoginPopup(true);
        return;
      }

      const error = validateForm(form, cartItems, payment);
      if (error) {
        alert(error);
        return;
      }

      setIsLoading(true);

      // Save address to user's localStorage
      saveAddressToUser(form, currentUser._id);

      console.log("Sending order request...");
      
      // Make API call to create order
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: cartItems,
          totals,
          address: form,
          paymentMethod: payment,
          orderNotes: orderNotes,
        }),
      });

      console.log("Response status:", res.status);
      
      const data = await res.json();
      console.log("API Response data:", data);

      if (!res.ok || !data.ok) {
        alert(data.message || checkoutTranslations.messages.orderFailed);
        setIsLoading(false);
        return;
      }

      if (!data.orderId) {
        console.error("No orderId in response:", data);
        alert("Order created but no order ID returned. Please contact support.");
        setIsLoading(false);
        return;
      }

      console.log("✅ Order created successfully! Order ID:", data.orderId);
      
      // Save order ID to localStorage for reference
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastOrderId', data.orderId);
      }
      
      // Clear the cart
      clearCart();
      console.log('✅ Cart cleared');
      
      // Redirect to success page with parameters
      const redirectUrl = `/order-success/${data.orderId}?payment=${encodeURIComponent(payment)}&email=${encodeURIComponent(form.email)}&name=${encodeURIComponent(form.fullName)}${orderNotes ? '&notes=' + encodeURIComponent(orderNotes.substring(0, 50)) : ''}`;
      console.log('Redirecting to:', redirectUrl);
      
      router.push(redirectUrl);
      
    } catch (error) {
      console.error("❌ Order placement error:", error);
      alert(checkoutTranslations.messages.networkError);
      setIsLoading(false);
    }
  };

  const isDisabled = !currentUser || validateForm(form, cartItems, payment) !== null || isLoading;

  return (
    <>
      <Navbar />
      
      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={handleLoginPopupClose}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-[#edf3ff] to-[#e6eeff]">
        <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
          {/* HEADER */}
          <div className="mb-8 lg:mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0A4C89] tracking-tight">
                {checkoutTranslations.header.title}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {checkoutTranslations.header.subtitle}
              </p>
            </div>

            {/* STEPS */}
            <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-0 flex-wrap text-[11px] sm:text-xs justify-start sm:justify-end">
              <Step done label={checkoutTranslations.header.steps[0]} />
              <Step active label={checkoutTranslations.header.steps[1]} />
              <Step label={checkoutTranslations.header.steps[2]} />
              <Step label={checkoutTranslations.header.steps[3]} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              <Card title={checkoutTranslations.deliveryAddress.title} icon={<MapPin size={18} />}>
                {currentUser && savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock size={16} />
                        {checkoutTranslations.deliveryAddress.savedAddresses}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddressList(!showAddressList)}
                        className="text-xs text-[#0A4C89] hover:text-[#0D5FA8] font-medium"
                      >
                        {showAddressList ? 
                          checkoutTranslations.deliveryAddress.hide : 
                          checkoutTranslations.deliveryAddress.show
                        } ({savedAddresses.length})
                      </button>
                    </div>

                    {showAddressList && (
                      <div className="space-y-3 mb-4">
                        {savedAddresses.map((address, index) => (
                          <div
                            key={index}
                            className={`flex items-start justify-between p-3 border rounded-xl ${
                              JSON.stringify(address) === JSON.stringify(form)
                                ? "border-[#0A4C89] bg-[#0A4C89]/5"
                                : "border-slate-200 bg-white/50"
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">
                                  {address.fullName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {address.phone}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {address.address}
                              </p>
                              <p className="text-xs text-gray-500">
                                {address.city}, {address.pincode},{" "}
                                {address.country}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-2">
                              <button
                                type="button"
                                onClick={() => loadSavedAddress(address)}
                                className="text-xs px-2 py-1 bg-[#0A4C89] text-white rounded hover:bg-[#0D5FA8]"
                              >
                                {checkoutTranslations.deliveryAddress.useAddress}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(index)}
                                className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    icon={<User size={16} />}
                    placeholder={checkoutTranslations.form.placeholders.fullName}
                    value={form.fullName}
                    onChange={onNameChange}
                    autoComplete="name"
                    inputMode="text"
                  />

                  <Input
                    icon={<Phone size={16} />}
                    placeholder={checkoutTranslations.form.placeholders.phone}
                    value={form.phone}
                    onChange={onPhoneChange}
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                  />

                  <Input
                    icon={<User size={16} />}
                    type="email"
                    placeholder={checkoutTranslations.form.placeholders.email}
                    value={form.email}
                    onChange={onEmailChange}
                    autoComplete="email"
                    inputMode="email"
                  />

                  <Input
                    className="sm:col-span-2"
                    placeholder={checkoutTranslations.form.placeholders.address}
                    value={form.address}
                    onChange={onChange("address")}
                  />
                  <Input
                    placeholder={checkoutTranslations.form.placeholders.city}
                    value={form.city}
                    onChange={onCityChange}
                    inputMode="text"
                    autoComplete="address-level2"
                  />

                  <Input
                    placeholder={checkoutTranslations.form.placeholders.pincode}
                    value={form.pincode}
                    onChange={onPincodeChange}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                  />

                  <Input
                    placeholder={checkoutTranslations.form.placeholders.country}
                    value={form.country}
                    onChange={onChange("country")}
                    autoComplete="country-name"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Save size={16} className="text-[#0A4C89]" />
                    <span className="text-xs text-gray-600">
                      {checkoutTranslations.deliveryAddress.saveForFuture}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveAddress}
                    disabled={!currentUser}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                      currentUser
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {checkoutTranslations.deliveryAddress.saveAddress}
                  </button>
                </div>

                {currentUser && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-medium">Note:</span>{" "}
                    {checkoutTranslations.deliveryAddress.note}
                  </div>
                )}
              </Card>

              {/* PAYMENT CARD */}
              <Card title={checkoutTranslations.payment.title} icon={<CreditCard size={18} />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <PayOption
                    active={payment === "card"}
                    onClick={() => setPayment("card")}
                    icon={<CreditCard />}
                    title={checkoutTranslations.payment.card?.title || "Credit / Debit Card"}
                    subtitle={checkoutTranslations.payment.card?.subtitle || "Visa • Mastercard • RuPay"}
                  />
                  <PayOption
                    active={payment === "bank"}
                    onClick={() => setPayment("bank")}
                    icon={<Landmark />}
                    title={checkoutTranslations.payment.bank?.title || "Bank Transfer"}
                    subtitle={checkoutTranslations.payment.bank?.subtitle || "Net Banking • UPI • IMPS"}
                  />
                  <PayOption
                    active={payment === "crypto"}
                    onClick={() => setPayment("crypto")}
                    icon={<Bitcoin />}
                    title={checkoutTranslations.payment.crypto?.title || "Cryptocurrency"}
                    subtitle={checkoutTranslations.payment.crypto?.subtitle || "BTC • ETH • USDT"}
                  />
                </div>

                {/* Order Notes Section */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="text-[#0A4C89]" />
                    {checkoutTranslations.payment.notes?.label || "Order Notes (Optional)"}
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder={checkoutTranslations.payment.notes?.placeholder || "Add any special instructions or notes for your order..."}
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#0A4C89]/30 focus:border-[#0A4C89]/50 outline-none text-sm resize-y"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>Maximum 500 characters</span>
                    <span>{orderNotes.length}/500</span>
                  </p>
                </div>

                <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                  <span className="inline-flex h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-[10px]">
                    🔒
                  </span>
                  {checkoutTranslations.payment.secure}
                </p>
              </Card>
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <div className="lg:sticky lg:top-24">
              <div
                className={[
                  "relative overflow-hidden rounded-2xl border border-white/60",
                  "bg-white/70 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.14)]",
                  "p-5 sm:p-6 md:p-7",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-br from-[#0A4C89]/10 via-transparent to-[#0D5FA8]/15" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
                        <Package size={18} />
                      </span>
                      <span>{checkoutTranslations.orderSummary.title}</span>
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                      <CheckCircle size={14} className="mr-1" />
                      {checkoutTranslations.orderSummary.secure}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scroll">
                    {cartItems.map((i) => (
                      <div
                        key={i.slug}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white/70 px-3 py-3 text-sm shadow-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">
                            {i.name}
                          </p>
                          
                          <p className="mt-0.5 text-xs text-gray-500">
                            Qty: {i.qty} units ({Math.ceil(i.qty / 50)} batch
                            {Math.ceil(i.qty / 50) > 1 ? "es" : ""})
                          </p>
                        </div>
                        <p className="font-semibold text-slate-900">
                          ₹{Number(i.price || 0) * Number(i.qty || 0)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4 space-y-2 text-sm">
                    <Row label={checkoutTranslations.orderSummary.items} value={totals.totalDistinct} />
                    <Row label={checkoutTranslations.orderSummary.totalUnits} value={totals.totalQty} />
                    <Row
                      label={checkoutTranslations.orderSummary.totalBatches}
                      value={`${totals.totalBulkUnits}`}
                    />
                    <Row
                      label={checkoutTranslations.orderSummary.totalAmount}
                      value={`₹${totals.totalPrice}`}
                      bold
                    />
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={isDisabled}
                    className={[
                      "mt-5 w-full py-3.5 rounded-xl text-sm sm:text-base font-semibold",
                      isDisabled
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#0A4C89] via-[#0D5FA8] to-[#1B78D1] text-white shadow-lg shadow-[#0A4C89]/30 hover:shadow-xl hover:translate-y-0.5 transition-all duration-200",
                    ].join(" ")}
                  >
                    {isLoading ? 
                      checkoutTranslations.orderSummary.processing : 
                      checkoutTranslations.orderSummary.placeOrder
                    }
                  </button>

                  <p className="mt-3 text-[11px] text-center text-gray-500">
                    {checkoutTranslations.orderSummary.trustedBy}
                  </p>

                  <Link
                    href="/products"
                    className="mt-4 block text-center text-xs sm:text-sm font-medium text-[#0A4C89] hover:text-[#0D5FA8] underline-offset-4 hover:underline"
                  >
                    {checkoutTranslations.orderSummary.continueShopping}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .custom-scroll::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.55);
            border-radius: 999px;
          }
        `}</style>
      </div>
    </>
  );
}

// UI Components
function Step({ label, active, done }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold
      ${
        active
          ? "bg-[#0A4C89] text-white shadow-sm"
          : done
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-200 text-slate-600"
      }`}
    >
      {done && <CheckCircle size={13} />}
      <span>{label}</span>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-100 shadow-[0_14px_35px_rgba(15,23,42,0.08)] p-5 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-4 sm:mb-5 text-slate-900">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0A4C89]/8 text-[#0A4C89]">
          {icon}
        </span>
        <span>{title}</span>
      </h2>
      {children}
    </div>
  );
}

function PayOption({ icon, title, subtitle, active, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={[
        "flex items-center gap-3 p-3.5 rounded-xl border text-left w-full",
        "transition-all duration-150",
        active
          ? "border-[#0A4C89] bg-[#0A4C89]/5 ring-2 ring-[#0A4C89]/20 shadow-sm"
          : "border-slate-200 hover:border-slate-400 hover:bg-slate-50/80",
      ].join(" ")}
    >
      <div className="w-11 h-11 rounded-xl bg-[#0A4C89]/10 flex items-center justify-center text-[#0A4C89]">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-sm text-slate-900">{title}</p>
        <p className="text-[11px] text-gray-500">{subtitle}</p>
      </div>
    </button>
  );
}

function Input({ icon, className = "", ...props }) {
  return (
    <div
      className={[
        "flex items-center gap-2 border rounded-xl px-3 py-2.5",
        "bg-white/80 shadow-xs border-slate-200",
        "focus-within:ring-2 focus-within:ring-[#0A4C89]/30 focus-within:border-[#0A4C89]/50",
        className,
      ].join(" ")}
    >
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <input
        {...props}
        className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
      />
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={bold ? "font-bold text-slate-900" : "font-semibold"}>
        {value}
      </span>
    </div>
  );
}




//Email js code 


// // app/checkout/CheckoutClient.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "../components/CartContext";
// import Link from "next/link";
// import Navbar from "../components/Navbar";
// import { getLoggedInUser } from "@/lib/auth";
// import { useLanguage } from "@/context/LanguageContext";
// import LoginPopup from "../components/LoginPopup";
// import emailjs from "@emailjs/browser";

// import {
//   MapPin,
//   Phone,
//   User,
//   CreditCard,
//   Package,
//   CheckCircle,
//   Save,
//   Clock,
//   X,
//   ShoppingCart,
//   Landmark,
//   Bitcoin,
//   FileText,
// } from "lucide-react";

// // Function to get user-specific address key
// const getUserAddressKey = (userId) => {
//   return `user_addresses_${userId}`;
// };

// // Function to save address to localStorage (user-specific)
// const saveAddressToUser = (form, userId) => {
//   if (!userId) return;

//   try {
//     const key = getUserAddressKey(userId);
//     const addresses = getUserAddresses(userId);

//     // Check if address already exists
//     const existingIndex = addresses.findIndex(
//       (addr) =>
//         addr.fullName === form.fullName &&
//         addr.phone === form.phone &&
//         addr.address === form.address &&
//         addr.pincode === form.pincode
//     );

//     // If it's a new address, add it (limit to 3 addresses)
//     if (existingIndex === -1) {
//       addresses.unshift(form);
//       // Keep only last 3 addresses
//       const limitedAddresses = addresses.slice(0, 3);
//       localStorage.setItem(key, JSON.stringify(limitedAddresses));
//     }
//   } catch (error) {
//     console.error("Error saving address to localStorage:", error);
//   }
// };

// // Function to get saved addresses for a specific user
// const getUserAddresses = (userId) => {
//   if (!userId) return [];

//   try {
//     const key = getUserAddressKey(userId);
//     const addressesStr = localStorage.getItem(key);
//     return addressesStr ? JSON.parse(addressesStr) : [];
//   } catch (error) {
//     console.error("Error getting addresses from localStorage:", error);
//     return [];
//   }
// };

// // Function to delete a saved address for a specific user
// const deleteUserAddress = (userId, index) => {
//   if (!userId) return [];

//   try {
//     const key = getUserAddressKey(userId);
//     const addresses = getUserAddresses(userId);
//     const newAddresses = addresses.filter((_, i) => i !== index);
//     localStorage.setItem(key, JSON.stringify(newAddresses));
//     return newAddresses;
//   } catch (error) {
//     console.error("Error deleting address:", error);
//     return [];
//   }
// };

// export default function CheckoutClient() {
//   const router = useRouter();
//   const { cartItems, totals, clearCart } = useCart();
//   const { t, language } = useLanguage();
  
//   const [payment, setPayment] = useState("card");
//   const [orderNotes, setOrderNotes] = useState("");
//   const [savedAddresses, setSavedAddresses] = useState([]);
//   const [showAddressList, setShowAddressList] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);
//   // Email sending state
//   const [emailError, setEmailError] = useState(null);
//   const [emailSent, setEmailSent] = useState(false);

//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     pincode: "",
//     country: "India",
//   });

//   // Initialize EmailJS
//   useEffect(() => {
//     // Initialize EmailJS with public key
//     const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
//     if (publicKey) {
//       emailjs.init(publicKey);
//     }
//   }, []);

//   // Get translations from context with fallbacks
//   const checkoutTranslations = t?.checkoutPage || {
//     header: {
//       title: "Secure Checkout",
//       subtitle: "Fast • Safe • Confidential",
//       steps: ["Cart", "Address", "Payment", "Confirm"]
//     },
//     emptyState: {
//       title: "Your cart is empty",
//       description: "Add products to continue checkout.",
//       browseButton: "Browse products"
//     },
//     deliveryAddress: {
//       title: "Delivery Address",
//       savedAddresses: "Your Saved Addresses",
//       show: "Show",
//       hide: "Hide",
//       useAddress: "Use",
//       saveAddress: "Save Address",
//       note: "Addresses are saved only for your account and won't be visible to other users.",
//       saveForFuture: "Save this address for future orders"
//     },
//     form: {
//       placeholders: {
//         fullName: "Full Name",
//         phone: "Phone Number",
//         email: "Email Address",
//         address: "Full Address",
//         city: "City",
//         pincode: "Pincode",
//         country: "Country"
//       }
//     },
//     payment: {
//       title: "Payment Method",
//       card: {
//         title: "Credit / Debit Card",
//         subtitle: "Visa • Mastercard • RuPay"
//       },
//       bank: {
//         title: "Bank Transfer",
//         subtitle: "Net Banking • UPI • IMPS"
//       },
//       crypto: {
//         title: "Cryptocurrency",
//         subtitle: "BTC • ETH • USDT"
//       },
//       secure: "All payments are encrypted & secure",
//       notes: {
//         label: "Order Notes (Optional)",
//         placeholder: "Add any special instructions or notes for your order..."
//       }
//     },
//     orderSummary: {
//       title: "Order Summary",
//       secure: "Secure & Private",
//       items: "Items",
//       totalUnits: "Total Units",
//       totalBatches: "Total Batches",
//       totalAmount: "Total amount",
//       placeOrder: "Place Secure Order",
//       processing: "Processing...",
//       trustedBy: "Trusted by healthcare professionals • Discreet packaging",
//       continueShopping: "Continue shopping"
//     },
//     validation: {
//       emptyCart: "Your cart is empty",
//       fullName: {
//         required: "Please enter a valid full name",
//         invalid: "Full name must contain only alphabets"
//       },
//       email: "Please enter a valid email address",
//       phone: "Phone number must be 10 digits",
//       address: "Please enter full delivery address",
//       city: "City is required",
//       pincode: "Pincode must be 6 digits",
//       country: "Country is required",
//       payment: "Please select a payment method"
//     },
//     messages: {
//       loginRequired: "Please login to continue checkout",
//       saveSuccess: "Address saved successfully!",
//       sessionExpired: "Session expired. Please login again.",
//       orderFailed: "Order failed",
//       networkError: "Network error. Please try again.",
//       emailSuccess: "Order confirmation email sent!",
//       emailError: "Failed to send confirmation email"
//     }
//   };

//   const validateForm = (form, cartItems, payment) => {
//     if (cartItems.length === 0) return checkoutTranslations.validation.emptyCart;

//     if (!form.fullName || form.fullName.length < 3)
//       return checkoutTranslations.validation.fullName.required;

//     if (!/^[A-Za-z ]+$/.test(form.fullName.trim()))
//       return checkoutTranslations.validation.fullName.invalid;

//     if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
//       return checkoutTranslations.validation.email;

//     if (!form.phone || !/^\d{10}$/.test(form.phone))
//       return checkoutTranslations.validation.phone;

//     if (!form.address || form.address.length < 10)
//       return checkoutTranslations.validation.address;

//     if (!form.city) return checkoutTranslations.validation.city;

//     if (!form.pincode || !/^\d{6}$/.test(form.pincode))
//       return checkoutTranslations.validation.pincode;

//     if (!form.country) return checkoutTranslations.validation.country;

//     if (!payment) return checkoutTranslations.validation.payment;

//     return null;
//   };

//   // Check authentication
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         setIsLoading(true);
        
//         // Check if cart is empty
//         if (cartItems.length === 0) {
//           setIsLoading(false);
//           return;
//         }

//         // Get current logged in user
//         const user = await getLoggedInUser();

//         if (!user || !user._id) {
//           // User is not logged in - show login popup
//           setShowLoginPopup(true);
//           setIsLoading(false);
//           return;
//         }

//         console.log("Current user:", user);
//         setCurrentUser(user);

//         // Load user-specific addresses
//         const addresses = getUserAddresses(user._id);
//         setSavedAddresses(addresses);

//         // If there are saved addresses, pre-fill with the most recent one
//         if (addresses.length > 0) {
//           setForm(addresses[0]);
//           setShowAddressList(true);
//         }
//       } catch (error) {
//         console.error("Error loading user/addresses:", error);
//         setShowLoginPopup(true);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, [router, cartItems.length]);

//   // Input change handlers
//   const onChange = (k) => (e) =>
//     setForm((p) => ({ ...p, [k]: e.target.value }));

//   const onNameChange = (e) => {
//     const cleaned = e.target.value.replace(/[^A-Za-z ]/g, "");
//     setForm((p) => ({ ...p, fullName: cleaned }));
//   };

//   const onPhoneChange = (e) => {
//     const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
//     setForm((p) => ({ ...p, phone: cleaned }));
//   };

//   const onPincodeChange = (e) => {
//     const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6);
//     setForm((p) => ({ ...p, pincode: cleaned }));
//   };

//   const onEmailChange = (e) => {
//     const cleaned = e.target.value.replace(/\s/g, "").toLowerCase();
//     setForm((p) => ({ ...p, email: cleaned }));
//   };

//   const onCityChange = (e) => {
//     const cleaned = e.target.value.replace(/[^A-Za-z ]/g, "");
//     setForm((p) => ({ ...p, city: cleaned }));
//   };

//   const handleLoginSuccess = (user) => {
//     setCurrentUser(user);
//     setShowLoginPopup(false);
    
//     // Reload addresses for the new user
//     const addresses = getUserAddresses(user._id);
//     setSavedAddresses(addresses);
    
//     if (addresses.length > 0) {
//       setForm(addresses[0]);
//       setShowAddressList(true);
//     }
//   };

//   const handleLoginPopupClose = () => {
//     setShowLoginPopup(false);
//     // If user closes popup without logging in, redirect to cart
//     router.push("/cart");
//   };

//   // Function to load a saved address
//   const loadSavedAddress = (address) => {
//     setForm(address);
//     setShowAddressList(false);
//   };

//   // Function to delete a saved address
//   const handleDeleteAddress = (index) => {
//     if (!currentUser?._id) return;

//     const newAddresses = deleteUserAddress(currentUser._id, index);
//     setSavedAddresses(newAddresses);

//     // If we deleted the current address, clear the form
//     if (JSON.stringify(form) === JSON.stringify(savedAddresses[index])) {
//       setForm({
//         fullName: "",
//         email: "",
//         phone: "",
//         address: "",
//         city: "",
//         pincode: "",
//         country: "India",
//       });
//     }
//   };

//   // Function to save current address
//   const handleSaveAddress = () => {
//     if (!currentUser?._id) {
//       setShowLoginPopup(true);
//       return;
//     }

//     saveAddressToUser(form, currentUser._id);

//     // Refresh addresses list
//     const updatedAddresses = getUserAddresses(currentUser._id);
//     setSavedAddresses(updatedAddresses);

//     // Show success message
//     alert(checkoutTranslations.messages.saveSuccess);
//   };

//   // Function to send order confirmation emails
//   const sendOrderEmails = async (orderData, orderId) => {
//     try {
//       setEmailError(null);
      
//       const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
//       const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
//       const TEMPLATE_ADMIN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN;
//       const TEMPLATE_USER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_USER;
//       const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "sales@edpharma.co";

//       if (!SERVICE_ID || !PUBLIC_KEY || !TEMPLATE_ADMIN || !TEMPLATE_USER) {
//         throw new Error("Email service not configured. Please check EmailJS env variables.");
//       }

//       // Format order items for email
//       const orderItemsList = orderData.items.map(item => 
//         `${item.name} - Qty: ${item.qty} units (${Math.ceil(item.qty / 50)} batches) - ₹${item.price * item.qty}`
//       ).join('\n');

//       const orderNumber = `ORD-${orderId.slice(-8)}`;
//       const submittedAt = new Date().toLocaleString("en-IN", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });

//       // Prepare address string
//       const addressString = `${orderData.address.address}, ${orderData.address.city}, ${orderData.address.pincode}, ${orderData.address.country}`;

//       // Payment method mapping
//       const paymentMethods = {
//         card: "Credit/Debit Card",
//         bank: "Bank Transfer (UPI/Net Banking)",
//         crypto: "Cryptocurrency"
//       };

//       // Admin email payload
//       const payloadAdmin = {
//         to_email: ADMIN_EMAIL,
//         from_name: orderData.address.fullName,
//         from_email: orderData.address.email,
//         phone: orderData.address.phone,
//         order_number: orderNumber,
//         order_id: orderId,
//         items: orderItemsList,
//         total_amount: `₹${orderData.totals.totalPrice}`,
//         total_units: orderData.totals.totalQty,
//         total_batches: orderData.totals.totalBulkUnits,
//         payment_method: paymentMethods[orderData.paymentMethod] || orderData.paymentMethod,
//         delivery_address: addressString,
//         order_notes: orderData.orderNotes || "No special instructions",
//         date: submittedAt,
//       };

//       // User email payload
//       const payloadUser = {
//         to_email: orderData.address.email,
//         to_name: orderData.address.fullName,
//         from_name: "ED Pharma",
//         order_number: orderNumber,
//         order_id: orderId,
//         items: orderItemsList,
//         total_amount: `₹${orderData.totals.totalPrice}`,
//         total_units: orderData.totals.totalQty,
//         total_batches: orderData.totals.totalBulkUnits,
//         payment_method: paymentMethods[orderData.paymentMethod] || orderData.paymentMethod,
//         delivery_address: addressString,
//         order_notes: orderData.orderNotes || "No special instructions",
//         date: submittedAt,
//       };

//       // Send both emails
//       const [adminRes, userRes] = await Promise.all([
//         emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, payloadAdmin, PUBLIC_KEY),
//         emailjs.send(SERVICE_ID, TEMPLATE_USER, payloadUser, PUBLIC_KEY),
//       ]);

//       console.log("✅ Order confirmation emails sent successfully");
//       setEmailSent(true);
//       return true;

//     } catch (error) {
//       console.error("❌ Error sending order emails:", error);
//       setEmailError(error.message || "Failed to send confirmation email");
//       return false;
//     }
//   };

//   const placeOrder = async () => {
//     try {
//       // Check authentication again before placing order
//       if (!currentUser || !currentUser._id) {
//         setShowLoginPopup(true);
//         return;
//       }

//       const error = validateForm(form, cartItems, payment);
//       if (error) {
//         alert(error);
//         return;
//       }

//       setIsLoading(true);
//       setEmailError(null);

//       // Save address to user's localStorage
//       saveAddressToUser(form, currentUser._id);

//       console.log("Sending order request...");
      
//       // Make API call to create order
//       const res = await fetch("/api/orders/create", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           items: cartItems,
//           totals,
//           address: form,
//           paymentMethod: payment,
//           orderNotes: orderNotes,
//         }),
//       });

//       console.log("Response status:", res.status);
      
//       const data = await res.json();
//       console.log("API Response data:", data);

//       if (!res.ok || !data.ok) {
//         alert(data.message || checkoutTranslations.messages.orderFailed);
//         setIsLoading(false);
//         return;
//       }

//       if (!data.orderId) {
//         console.error("No orderId in response:", data);
//         alert("Order created but no order ID returned. Please contact support.");
//         setIsLoading(false);
//         return;
//       }

//       console.log("✅ Order created successfully! Order ID:", data.orderId);
      
//       // Send order confirmation emails (don't wait for this to complete)
//       sendOrderEmails({
//         items: cartItems,
//         totals,
//         address: form,
//         paymentMethod: payment,
//         orderNotes,
//       }, data.orderId).then(success => {
//         if (success) {
//           console.log("✅ Order confirmation emails sent");
//         } else {
//           console.warn("⚠️ Order confirmation emails failed");
//         }
//       });
      
//       // Save order ID to localStorage for reference
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('lastOrderId', data.orderId);
//       }
      
//       // Clear the cart
//       clearCart();
//       console.log('✅ Cart cleared');
      
//       // Redirect to success page with parameters
//       const redirectUrl = `/order-success/${data.orderId}?payment=${encodeURIComponent(payment)}&email=${encodeURIComponent(form.email)}&name=${encodeURIComponent(form.fullName)}${orderNotes ? '&notes=' + encodeURIComponent(orderNotes.substring(0, 50)) : ''}`;
//       console.log('Redirecting to:', redirectUrl);
      
//       router.push(redirectUrl);
      
//     } catch (error) {
//       console.error("❌ Order placement error:", error);
//       alert(checkoutTranslations.messages.networkError);
//       setIsLoading(false);
//     }
//   };

//   const isDisabled = !currentUser || validateForm(form, cartItems, payment) !== null || isLoading;

//   // Show loading state
//   if (isLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-[#edf3ff] to-[#e6eeff] flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-[#0A4C89] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading checkout...</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <>
//         <Navbar />
//         <div className="min-h-[60vh] flex items-center justify-center px-4">
//           <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm px-6 py-10 text-center">
//             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
//               <ShoppingCart size={28} />
//             </div>

//             <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
//               {checkoutTranslations.emptyState.title}
//             </h1>
//             <p className="text-sm md:text-base text-gray-500 mb-6">
//               {checkoutTranslations.emptyState.description}
//             </p>

//             <Link
//               href="/products"
//               className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0A4C89] to-[#0D5FA8] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition-transform"
//             >
//               {checkoutTranslations.emptyState.browseButton}
//               <span aria-hidden>→</span>
//             </Link>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
      
//       {/* Login Popup */}
//       <LoginPopup 
//         isOpen={showLoginPopup}
//         onClose={handleLoginPopupClose}
//         onLoginSuccess={handleLoginSuccess}
//       />
      
//       <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-[#edf3ff] to-[#e6eeff]">
//         <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
//           {/* HEADER */}
//           <div className="mb-8 lg:mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-[#0A4C89] tracking-tight">
//                 {checkoutTranslations.header.title}
//               </h1>
//               <p className="text-gray-600 text-sm sm:text-base">
//                 {checkoutTranslations.header.subtitle}
//               </p>
//             </div>

//             {/* STEPS */}
//             <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-0 flex-wrap text-[11px] sm:text-xs justify-start sm:justify-end">
//               <Step done label={checkoutTranslations.header.steps[0]} />
//               <Step active label={checkoutTranslations.header.steps[1]} />
//               <Step label={checkoutTranslations.header.steps[2]} />
//               <Step label={checkoutTranslations.header.steps[3]} />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
//             {/* LEFT SIDE */}
//             <div className="space-y-6">
//               <Card title={checkoutTranslations.deliveryAddress.title} icon={<MapPin size={18} />}>
//                 {currentUser && savedAddresses.length > 0 && (
//                   <div className="mb-6">
//                     <div className="flex items-center justify-between mb-3">
//                       <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                         <Clock size={16} />
//                         {checkoutTranslations.deliveryAddress.savedAddresses}
//                       </h3>
//                       <button
//                         type="button"
//                         onClick={() => setShowAddressList(!showAddressList)}
//                         className="text-xs text-[#0A4C89] hover:text-[#0D5FA8] font-medium"
//                       >
//                         {showAddressList ? 
//                           checkoutTranslations.deliveryAddress.hide : 
//                           checkoutTranslations.deliveryAddress.show
//                         } ({savedAddresses.length})
//                       </button>
//                     </div>

//                     {showAddressList && (
//                       <div className="space-y-3 mb-4">
//                         {savedAddresses.map((address, index) => (
//                           <div
//                             key={index}
//                             className={`flex items-start justify-between p-3 border rounded-xl ${
//                               JSON.stringify(address) === JSON.stringify(form)
//                                 ? "border-[#0A4C89] bg-[#0A4C89]/5"
//                                 : "border-slate-200 bg-white/50"
//                             }`}
//                           >
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <span className="font-semibold text-sm">
//                                   {address.fullName}
//                                 </span>
//                                 <span className="text-xs text-gray-500">
//                                   {address.phone}
//                                 </span>
//                               </div>
//                               <p className="text-xs text-gray-600 mb-1">
//                                 {address.address}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {address.city}, {address.pincode},{" "}
//                                 {address.country}
//                               </p>
//                             </div>
//                             <div className="flex gap-2 ml-2">
//                               <button
//                                 type="button"
//                                 onClick={() => loadSavedAddress(address)}
//                                 className="text-xs px-2 py-1 bg-[#0A4C89] text-white rounded hover:bg-[#0D5FA8]"
//                               >
//                                 {checkoutTranslations.deliveryAddress.useAddress}
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={() => handleDeleteAddress(index)}
//                                 className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
//                               >
//                                 <X size={12} />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <Input
//                     icon={<User size={16} />}
//                     placeholder={checkoutTranslations.form.placeholders.fullName}
//                     value={form.fullName}
//                     onChange={onNameChange}
//                     autoComplete="name"
//                     inputMode="text"
//                   />

//                   <Input
//                     icon={<Phone size={16} />}
//                     placeholder={checkoutTranslations.form.placeholders.phone}
//                     value={form.phone}
//                     onChange={onPhoneChange}
//                     inputMode="numeric"
//                     autoComplete="tel"
//                     maxLength={10}
//                   />

//                   <Input
//                     icon={<User size={16} />}
//                     type="email"
//                     placeholder={checkoutTranslations.form.placeholders.email}
//                     value={form.email}
//                     onChange={onEmailChange}
//                     autoComplete="email"
//                     inputMode="email"
//                   />

//                   <Input
//                     className="sm:col-span-2"
//                     placeholder={checkoutTranslations.form.placeholders.address}
//                     value={form.address}
//                     onChange={onChange("address")}
//                   />
//                   <Input
//                     placeholder={checkoutTranslations.form.placeholders.city}
//                     value={form.city}
//                     onChange={onCityChange}
//                     inputMode="text"
//                     autoComplete="address-level2"
//                   />

//                   <Input
//                     placeholder={checkoutTranslations.form.placeholders.pincode}
//                     value={form.pincode}
//                     onChange={onPincodeChange}
//                     inputMode="numeric"
//                     autoComplete="postal-code"
//                     maxLength={6}
//                   />

//                   <Input
//                     placeholder={checkoutTranslations.form.placeholders.country}
//                     value={form.country}
//                     onChange={onChange("country")}
//                     autoComplete="country-name"
//                   />
//                 </div>

//                 <div className="mt-4 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Save size={16} className="text-[#0A4C89]" />
//                     <span className="text-xs text-gray-600">
//                       {checkoutTranslations.deliveryAddress.saveForFuture}
//                     </span>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleSaveAddress}
//                     disabled={!currentUser}
//                     className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
//                       currentUser
//                         ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
//                         : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     }`}
//                   >
//                     {checkoutTranslations.deliveryAddress.saveAddress}
//                   </button>
//                 </div>

//                 {currentUser && (
//                   <div className="mt-2 text-xs text-gray-500">
//                     <span className="font-medium">Note:</span>{" "}
//                     {checkoutTranslations.deliveryAddress.note}
//                   </div>
//                 )}
//               </Card>

//               {/* PAYMENT CARD */}
//               <Card title={checkoutTranslations.payment.title} icon={<CreditCard size={18} />}>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//                   <PayOption
//                     active={payment === "card"}
//                     onClick={() => setPayment("card")}
//                     icon={<CreditCard />}
//                     title={checkoutTranslations.payment.card?.title || "Credit / Debit Card"}
//                     subtitle={checkoutTranslations.payment.card?.subtitle || "Visa • Mastercard • RuPay"}
//                   />
//                   <PayOption
//                     active={payment === "bank"}
//                     onClick={() => setPayment("bank")}
//                     icon={<Landmark />}
//                     title={checkoutTranslations.payment.bank?.title || "Bank Transfer"}
//                     subtitle={checkoutTranslations.payment.bank?.subtitle || "Net Banking • UPI • IMPS"}
//                   />
//                   <PayOption
//                     active={payment === "crypto"}
//                     onClick={() => setPayment("crypto")}
//                     icon={<Bitcoin />}
//                     title={checkoutTranslations.payment.crypto?.title || "Cryptocurrency"}
//                     subtitle={checkoutTranslations.payment.crypto?.subtitle || "BTC • ETH • USDT"}
//                   />
//                 </div>

//                 {/* Order Notes Section */}
//                 <div className="mt-6 pt-4 border-t border-slate-200">
//                   <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
//                     <FileText size={16} className="text-[#0A4C89]" />
//                     {checkoutTranslations.payment.notes?.label || "Order Notes (Optional)"}
//                   </label>
//                   <textarea
//                     value={orderNotes}
//                     onChange={(e) => setOrderNotes(e.target.value)}
//                     placeholder={checkoutTranslations.payment.notes?.placeholder || "Add any special instructions or notes for your order..."}
//                     rows="3"
//                     className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#0A4C89]/30 focus:border-[#0A4C89]/50 outline-none text-sm resize-y"
//                     maxLength={500}
//                   />
//                   <p className="text-xs text-gray-500 mt-1 flex justify-between">
//                     <span>Maximum 500 characters</span>
//                     <span>{orderNotes.length}/500</span>
//                   </p>
//                 </div>

//                 <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
//                   <span className="inline-flex h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-[10px]">
//                     🔒
//                   </span>
//                   {checkoutTranslations.payment.secure}
//                 </p>
//               </Card>
//             </div>

//             {/* RIGHT SIDE - ORDER SUMMARY */}
//             <div className="lg:sticky lg:top-24">
//               <div
//                 className={[
//                   "relative overflow-hidden rounded-2xl border border-white/60",
//                   "bg-white/70 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.14)]",
//                   "p-5 sm:p-6 md:p-7",
//                 ].join(" ")}
//               >
//                 <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-br from-[#0A4C89]/10 via-transparent to-[#0D5FA8]/15" />

//                 <div className="relative">
//                   <div className="flex items-center justify-between gap-2 mb-4">
//                     <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
//                       <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
//                         <Package size={18} />
//                       </span>
//                       <span>{checkoutTranslations.orderSummary.title}</span>
//                     </h2>
//                     <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
//                       <CheckCircle size={14} className="mr-1" />
//                       {checkoutTranslations.orderSummary.secure}
//                     </span>
//                   </div>

//                   <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scroll">
//                     {cartItems.map((i) => (
//                       <div
//                         key={i.slug}
//                         className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white/70 px-3 py-3 text-sm shadow-sm"
//                       >
//                         <div className="min-w-0">
//                           <p className="font-semibold text-slate-800 truncate">
//                             {i.name}
//                           </p>
                          
//                           <p className="mt-0.5 text-xs text-gray-500">
//                             Qty: {i.qty} units ({Math.ceil(i.qty / 50)} batch
//                             {Math.ceil(i.qty / 50) > 1 ? "es" : ""})
//                           </p>
//                         </div>
//                         <p className="font-semibold text-slate-900">
//                           ₹{Number(i.price || 0) * Number(i.qty || 0)}
//                         </p>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-5 border-t border-slate-100 pt-4 space-y-2 text-sm">
//                     <Row label={checkoutTranslations.orderSummary.items} value={totals.totalDistinct} />
//                     <Row label={checkoutTranslations.orderSummary.totalUnits} value={totals.totalQty} />
//                     <Row
//                       label={checkoutTranslations.orderSummary.totalBatches}
//                       value={`${totals.totalBulkUnits}`}
//                     />
//                     <Row
//                       label={checkoutTranslations.orderSummary.totalAmount}
//                       value={`₹${totals.totalPrice}`}
//                       bold
//                     />
//                   </div>

//                   {/* Email status message */}
//                   {emailError && (
//                     <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
//                       <p className="text-xs text-amber-700 flex items-center gap-1">
//                         <span>⚠️</span>
//                         {checkoutTranslations.messages.emailError}: {emailError}
//                       </p>
//                     </div>
//                   )}

//                   <button
//                     onClick={placeOrder}
//                     disabled={isDisabled}
//                     className={[
//                       "mt-5 w-full py-3.5 rounded-xl text-sm sm:text-base font-semibold",
//                       isDisabled
//                         ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                         : "bg-gradient-to-r from-[#0A4C89] via-[#0D5FA8] to-[#1B78D1] text-white shadow-lg shadow-[#0A4C89]/30 hover:shadow-xl hover:translate-y-0.5 transition-all duration-200",
//                     ].join(" ")}
//                   >
//                     {isLoading ? 
//                       checkoutTranslations.orderSummary.processing : 
//                       checkoutTranslations.orderSummary.placeOrder
//                     }
//                   </button>

//                   <p className="mt-3 text-[11px] text-center text-gray-500">
//                     {checkoutTranslations.orderSummary.trustedBy}
//                   </p>

//                   <Link
//                     href="/products"
//                     className="mt-4 block text-center text-xs sm:text-sm font-medium text-[#0A4C89] hover:text-[#0D5FA8] underline-offset-4 hover:underline"
//                   >
//                     {checkoutTranslations.orderSummary.continueShopping}
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <style jsx>{`
//           .custom-scroll::-webkit-scrollbar {
//             width: 5px;
//           }
//           .custom-scroll::-webkit-scrollbar-track {
//             background: transparent;
//           }
//           .custom-scroll::-webkit-scrollbar-thumb {
//             background: rgba(148, 163, 184, 0.55);
//             border-radius: 999px;
//           }
//         `}</style>
//       </div>
//     </>
//   );
// }

// // UI Components
// function Step({ label, active, done }) {
//   return (
//     <div
//       className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold
//       ${
//         active
//           ? "bg-[#0A4C89] text-white shadow-sm"
//           : done
//           ? "bg-emerald-50 text-emerald-700"
//           : "bg-slate-200 text-slate-600"
//       }`}
//     >
//       {done && <CheckCircle size={13} />}
//       <span>{label}</span>
//     </div>
//   );
// }

// function Card({ title, icon, children }) {
//   return (
//     <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-100 shadow-[0_14px_35px_rgba(15,23,42,0.08)] p-5 sm:p-6">
//       <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-4 sm:mb-5 text-slate-900">
//         <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0A4C89]/8 text-[#0A4C89]">
//           {icon}
//         </span>
//         <span>{title}</span>
//       </h2>
//       {children}
//     </div>
//   );
// }

// function PayOption({ icon, title, subtitle, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       type="button"
//       className={[
//         "flex items-center gap-3 p-3.5 rounded-xl border text-left w-full",
//         "transition-all duration-150",
//         active
//           ? "border-[#0A4C89] bg-[#0A4C89]/5 ring-2 ring-[#0A4C89]/20 shadow-sm"
//           : "border-slate-200 hover:border-slate-400 hover:bg-slate-50/80",
//       ].join(" ")}
//     >
//       <div className="w-11 h-11 rounded-xl bg-[#0A4C89]/10 flex items-center justify-center text-[#0A4C89]">
//         {icon}
//       </div>
//       <div>
//         <p className="font-semibold text-sm text-slate-900">{title}</p>
//         <p className="text-[11px] text-gray-500">{subtitle}</p>
//       </div>
//     </button>
//   );
// }

// function Input({ icon, className = "", ...props }) {
//   return (
//     <div
//       className={[
//         "flex items-center gap-2 border rounded-xl px-3 py-2.5",
//         "bg-white/80 shadow-xs border-slate-200",
//         "focus-within:ring-2 focus-within:ring-[#0A4C89]/30 focus-within:border-[#0A4C89]/50",
//         className,
//       ].join(" ")}
//     >
//       {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
//       <input
//         {...props}
//         className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
//       />
//     </div>
//   );
// }

// function Row({ label, value, bold }) {
//   return (
//     <div className="flex justify-between text-sm">
//       <span className="text-gray-600">{label}</span>
//       <span className={bold ? "font-bold text-slate-900" : "font-semibold"}>
//         {value}
//       </span>
//     </div>
//   );
// }

