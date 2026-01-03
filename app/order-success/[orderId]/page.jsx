"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Truck,
  Shield,
  Download,
  Mail,
  Clock,
  Home,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../components/CartContext";
import Confetti from "react-confetti";

export default function OrderSuccessPage() {
  const router = useRouter();
  const params = useParams();
  
  // FIXED: Since your folder is [orderId], use params.orderId
  const orderId = params.orderId;
  
  const { clearCart } = useCart();
  const [cartCleared, setCartCleared] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("=== ORDER SUCCESS DEBUG ===");
    console.log("Page params:", params);
    console.log("Order ID from params.orderId:", params.orderId);
    console.log("Full URL:", window.location.href);
    console.log("Pathname:", window.location.pathname);
    console.log("=== END DEBUG ===");
    
    setIsClient(true);
    
    // If no order ID, show error
    if (!orderId) {
      console.error("No order ID found in URL");
      setError("No order ID found. Please check your order.");
      setIsLoading(false);
      return;
    }
    
    // Clear cart only once
    if (!cartCleared) {
      try {
        clearCart();
        localStorage.removeItem("cart");
        setCartCleared(true);
        console.log("Cart cleared successfully");
      } catch (err) {
        console.error("Error clearing cart:", err);
      }
    }

    // Set loading to false after component mounts
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Hide confetti after 5 seconds
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(confettiTimer);
    };
  }, [orderId, clearCart, cartCleared, router, params]);

  // Handle receipt download
  const handleDownloadReceipt = () => {
    alert(`Receipt for order ${orderId} downloaded successfully!`);
  };

  // Handle email receipt
  const handleEmailReceipt = () => {
    const emailSubject = `Your Order Confirmation - ${orderId}`;
    const emailBody = `Thank you for your order!\n\nOrder ID: ${orderId}\nDate: ${new Date().toLocaleDateString()}\n\nBest regards,\nYour Store Team`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  // Format date
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Order Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              href="/orders"
              className="block w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/"
              className="block w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-4 animate-pulse">
            <CheckCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Your Order...
          </h2>
          <p className="text-gray-600">Preparing your order confirmation</p>
          {orderId && (
            <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 md:py-12">
      {/* Confetti Effect */}
      {showConfetti && isClient && (
        <Confetti
          recycle={false}
          numberOfPieces={100}
          gravity={0.1}
          className="!fixed"
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-6 shadow-lg shadow-emerald-200">
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Thank you for your purchase. We've received your order #{orderId} and it's being processed.
          </p>
          
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
            <CheckCircle size={14} />
            <span>Payment confirmed • Email sent • Processing order</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="text-lg font-bold text-gray-900">{orderId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-900">
                      {isClient ? formatDate() : "Loading..."}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Payment Method</p>
                    </div>
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Delivery</p>
                    </div>
                    <p className="font-medium text-gray-900">Standard (2-3 days)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
              
              <div className="space-y-6">
                {[
                  { 
                    icon: CheckCircle, 
                    title: "Order Placed", 
                    description: "Your order has been received",
                    status: "complete",
                    time: "Just now"
                  },
                  { 
                    icon: Clock, 
                    title: "Processing", 
                    description: "We're preparing your items",
                    status: "current",
                    time: "Today"
                  },
                  { 
                    icon: Truck, 
                    title: "Shipping", 
                    description: "Estimated delivery in 2-3 days",
                    status: "pending",
                    time: "Tomorrow"
                  },
                  { 
                    icon: Home, 
                    title: "Delivered", 
                    description: "Will arrive at your doorstep",
                    status: "pending",
                    time: "2-3 days"
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                      ${step.status === 'complete' ? 'bg-emerald-100 text-emerald-600' :
                        step.status === 'current' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-400'}`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{step.title}</p>
                          <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{step.time}</p>
                        </div>
                        {step.status === 'complete' && (
                          <span className="px-3 py-1 text-sm font-medium bg-emerald-50 text-emerald-600 rounded-full">
                            Complete
                          </span>
                        )}
                        {step.status === 'current' && (
                          <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-full">
                            In Progress
                          </span>
                        )}
                      </div>
                      {index < 3 && (
                        <div className="h-6 w-0.5 bg-gray-200 ml-5 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href={`/orders/${orderId}`}
                className="group flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                View Order Details
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products"
                className="group flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                Continue Shopping
              </Link>

              <button
                onClick={handleDownloadReceipt}
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </button>

              <button
                onClick={handleEmailReceipt}
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                Email Receipt
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to help with any questions about your order.
              </p>
              <Link
                href="/contact"
                className="block text-center text-blue-600 hover:text-blue-700 font-medium py-3 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                Contact Support
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    <span className="text-gray-700 group-hover:text-blue-600">View All Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
                </Link>
                
                <Link
                  href="/profile"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                    <span className="text-gray-700 group-hover:text-emerald-600">Account Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600" />
                </Link>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery Updates</h3>
                  <p className="text-sm text-gray-600">We'll keep you posted</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 hover:bg-white/50 rounded-lg transition-colors">
                  <span className="text-sm text-gray-600">Estimated Delivery</span>
                  <span className="font-semibold text-gray-900">2-3 business days</span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-white/50 rounded-lg transition-colors">
                  <span className="text-sm text-gray-600">Tracking Number</span>
                  <span className="font-medium text-blue-600">Will be provided</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 text-sm text-gray-500 bg-gray-50 px-6 py-3 rounded-full mb-4">
            <span>Order ID: {orderId}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{isClient ? formatDate() : "Loading..."}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-emerald-600 font-medium">✓ Confirmed</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto">
            A confirmation email has been sent to your registered email address.
            You can track your order status anytime from the{" "}
            <Link href="/orders" className="text-blue-600 hover:text-blue-700 font-medium underline hover:no-underline">
              My Orders
            </Link>{" "}
            section.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <Link href="/help" className="hover:text-gray-700 transition-colors">
              Help Center
            </Link>
            <Link href="/shipping" className="hover:text-gray-700 transition-colors">
              Shipping Policy
            </Link>
            <Link href="/returns" className="hover:text-gray-700 transition-colors">
              Returns & Refunds
            </Link>
            <Link href="/contact" className="hover:text-gray-700 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}