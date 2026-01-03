"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ADD THIS IMPORT
import { useCart } from "../components/CartContext";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { getLoggedInUser } from "@/lib/auth";

import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Package,
  Wallet,
  IndianRupee,
  CheckCircle,
  Save,
  Clock,
  X,
} from "lucide-react";

const validateForm = (form, cartItems, payment) => {
  if (cartItems.length === 0) return "Your cart is empty";

  if (!form.fullName || form.fullName.length < 3)
    return "Please enter a valid full name";

  if (!/^[A-Za-z ]+$/.test(form.fullName.trim()))
    return "Full name must contain only alphabets";

  if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
    return "Please enter a valid email address";

  if (!form.phone || !/^\d{10}$/.test(form.phone))
    return "Phone number must be 10 digits";

  if (!form.address || form.address.length < 10)
    return "Please enter full delivery address";

  if (!form.city) return "City is required";

  if (!form.pincode || !/^\d{6}$/.test(form.pincode))
    return "Pincode must be 6 digits";

  if (!form.country) return "Country is required";

  if (!payment) return "Please select a payment method";

  return null;
};

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
  const router = useRouter(); // ADD THIS
  const { cartItems, totals, clearCart } = useCart();

  const [payment, setPayment] = useState("cod");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressList, setShowAddressList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    country: "India",
  });

  // Check authentication and load user-specific addresses
  useEffect(() => {
    const loadUserAndAddresses = async () => {
      try {
        setIsLoading(true);

        // Get current logged in user
        const user = getLoggedInUser();

        if (!user || !user._id) {
          // User is not logged in - show alert and redirect
          setTimeout(() => {
            alert("Please login to continue checkout");
            router.push("/"); // FIXED: Use router
          }, 100);
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
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAndAddresses();
  }, [router]); // ADD router to dependencies

  const isDisabled =
    validateForm(form, cartItems, payment) !== null ||
    isLoading ||
    !currentUser;

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
      alert("Please login to save addresses");
      return;
    }

    saveAddressToUser(form, currentUser._id);

    // Refresh addresses list
    const updatedAddresses = getUserAddresses(currentUser._id);
    setSavedAddresses(updatedAddresses);

    // Show success message
    alert("Address saved successfully!");
  };

  const placeOrder = async () => {
    try {
      // Check authentication again before placing order
      const user = getLoggedInUser();
      if (!user || !user._id) {
        alert("Please login to continue checkout");
        router.push("/"); // FIXED: Use router
        return;
      }

      const error = validateForm(form, cartItems, payment);
      if (error) {
        alert(error);
        return;
      }

      setIsLoading(true);

      // Save address to user's localStorage
      saveAddressToUser(form, user._id);

      console.log("Sending order request...");
      
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cartItems,
          totals,
          address: form,
          paymentMethod: payment,
        }),
      });

      console.log("Response status:", res.status);
      
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/login"); // FIXED: Use router
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok || !data.ok) {
        alert(data.message || "Order failed");
        setIsLoading(false);
        return;
      }

      if (!data.orderId) {
        console.error("No orderId in response:", data);
        alert("Order created but no order ID returned");
        setIsLoading(false);
        return;
      }

      console.log("Redirecting to order-success with ID:", data.orderId);
      clearCart();
      
      // FIXED: Use router.push for Next.js navigation
      router.push(`/order-success/${data.orderId}`);
      
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 ">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl shadow-sm px-6 py-10  text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A4C89]/10 text-[#0A4C89]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.4 12.3a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.7L21 6H6" />
            </svg>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-sm md:text-base text-gray-500 mb-6">
            Add products to continue checkout.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0A4C89] to-[#0D5FA8] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition-transform"
          >
            Browse products
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] via-[#edf3ff] to-[#e6eeff] ">
        <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
          {/* HEADER */}
          <div className="mb-8 lg:mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0A4C89] tracking-tight">
                Secure Checkout
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Fast • Safe • Confidential
              </p>
            </div>

            {/* STEPS */}
            <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-0 flex-wrap text-[11px] sm:text-xs justify-start sm:justify-end">
              <Step done label="Cart" />
              <Step active label="Address" />
              <Step label="Payment" />
              <Step label="Confirm" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              <Card title="Delivery Address" icon={<MapPin size={18} />}>
                {currentUser && savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock size={16} />
                        Your Saved Addresses
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddressList(!showAddressList)}
                        className="text-xs text-[#0A4C89] hover:text-[#0D5FA8] font-medium"
                      >
                        {showAddressList ? "Hide" : "Show"} (
                        {savedAddresses.length})
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
                                Use
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
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={onNameChange}
                    autoComplete="name"
                    inputMode="text"
                  />

                  <Input
                    icon={<Phone size={16} />}
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={onPhoneChange}
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                  />

                  <Input
                    icon={<User size={16} />}
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={onEmailChange}
                    autoComplete="email"
                    inputMode="email"
                  />

                  <Input
                    className="sm:col-span-2"
                    placeholder="Full Address"
                    value={form.address}
                    onChange={onChange("address")}
                  />
                  <Input
                    placeholder="City"
                    value={form.city}
                    onChange={onCityChange}
                    inputMode="text"
                    autoComplete="address-level2"
                  />

                  <Input
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={onPincodeChange}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                  />

                  <Input
                    placeholder="Country"
                    value={form.country}
                    onChange={onChange("country")}
                    autoComplete="country-name"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Save size={16} className="text-[#0A4C89]" />
                    <span className="text-xs text-gray-600">
                      Save this address for future orders
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
                    Save Address
                  </button>
                </div>

                {currentUser && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-medium">Note:</span> Addresses are
                    saved only for your account and {`won't`} be visible to other
                    users.
                  </div>
                )}
              </Card>

              {/* PAYMENT CARD (unchanged) */}
              <Card title="Payment Method" icon={<CreditCard size={18} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <PayOption
                    active={payment === "cod"}
                    onClick={() => setPayment("cod")}
                    icon={<IndianRupee />}
                    title="Cash on Delivery"
                    subtitle="Pay when you receive"
                  />
                  <PayOption
                    active={payment === "upi"}
                    onClick={() => setPayment("upi")}
                    icon={<Wallet />}
                    title="UPI"
                    subtitle="GPay • PhonePe • Paytm"
                  />
                  <PayOption
                    active={payment === "card"}
                    onClick={() => setPayment("card")}
                    icon={<CreditCard />}
                    title="Credit / Debit Card"
                    subtitle="Visa • Mastercard"
                  />
                  <PayOption
                    active={payment === "wallet"}
                    onClick={() => setPayment("wallet")}
                    icon={<Wallet />}
                    title="Wallets"
                    subtitle="Paytm • Amazon Pay"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                  <span className="inline-flex h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-[10px]">
                    🔒
                  </span>
                  All payments are encrypted & secure
                </p>
              </Card>
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY (unchanged) */}
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
                      <span>Order Summary</span>
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                      <CheckCircle size={14} className="mr-1" />
                      Secure & Private
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
                          {/* UPDATE THIS LINE: Show bulk quantity */}
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
                    <Row label="Items" value={totals.totalDistinct} />
                    {/* ADD THESE TWO LINES: */}
                    <Row label="Total Units" value={totals.totalQty} />
                    <Row
                      label="Total Batches"
                      value={`${totals.totalBulkUnits}`}
                    />
                    <Row
                      label="Total amount"
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
                        : "bg-gradient-to-r from-[#0A4C89] via-[#0D5FA8] to-[#1B78D1] text-white shadow-lg shadow-[#0A4C89]/30 hover:shadow-xl hover:translate-y-0.5",
                    ].join(" ")}
                  >
                    {isLoading ? "Processing..." : "Place Secure Order"}
                  </button>

                  <p className="mt-3 text-[11px] text-center text-gray-500">
                    Trusted by healthcare professionals • Discreet packaging
                  </p>

                  <Link
                    href="/products"
                    className="mt-4 block text-center text-xs sm:text-sm font-medium text-[#0A4C89] hover:text-[#0D5FA8] underline-offset-4 hover:underline"
                  >
                    Continue shopping
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

// UI Components (keep these the same)
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