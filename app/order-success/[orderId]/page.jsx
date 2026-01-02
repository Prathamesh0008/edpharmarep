"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  ArrowRight,
  ClipboardList,
  Truck,
  Shield,
  Download,
  Sparkles,
  Mail,
  Clock,
  Home,
  CreditCard,
  ExternalLink
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../components/CartContext";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { clearCart } = useCart();
  const [cartCleared, setCartCleared] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Set client state and initialize
  useEffect(() => {
    setIsClient(true);
    
    if (!cartCleared) {
      clearCart();
      setCartCleared(true);
      localStorage.removeItem("cart");
    }

    // Set current date on client side only
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }));

    // Show animation after component mounts
    setShowAnimation(true);
    
    // Hide animation after 5 seconds
    const timer = setTimeout(() => setShowAnimation(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Handle receipt download
  const handleDownloadReceipt = () => {
    // Create a receipt PDF (simulated)
    const receiptContent = `
      ORDER CONFIRMATION
      ==================
      
      Order ID: ${orderId}
      Date: ${new Date().toLocaleDateString()}
      Status: Confirmed
      
      Thank you for your purchase!
      
      You can view your order details at: 
      ${window.location.origin}/orders/${orderId}
      
      ---
      This is a simulated receipt.
    `;
    
    // Create blob and download link
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success feedback
    alert(`Receipt for order ${orderId} downloaded successfully!`);
  };

  // Handle email receipt
  const handleEmailReceipt = () => {
    const emailSubject = `Your Order Confirmation - ${orderId}`;
    const emailBody = `Dear Customer,\n\nThank you for your order!\n\nOrder ID: ${orderId}\nDate: ${new Date().toLocaleDateString()}\nStatus: Confirmed\n\nYou can view your order details here: ${window.location.origin}/orders/${orderId}\n\nBest regards,\nThe Store Team`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  // Handle contact support
  const handleContactSupport = () => {
    // Redirect to support page or open contact modal
    window.location.href = "/contact";
    // Or open a modal/support chat
    // alert("Support chat opening soon...");
  };

  // Handle newsletter subscription
  const handleNewsletterSubscribe = (e) => {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    
    if (emailInput && emailInput.value) {
      alert(`Thank you for subscribing with ${emailInput.value}! You'll receive 15% off your next purchase.`);
      emailInput.value = "";
    } else {
      alert("Please enter a valid email address.");
    }
  };

  // Generate confetti only on client
  const ConfettiEffect = () => {
    if (!isClient || !showAnimation) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 animate-confetti rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 md:py-12 relative overflow-hidden">
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti-fall linear forwards;
        }
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .hover\:animate-bounce:hover {
          animation: bounce 0.5s ease-in-out;
        }
      `}</style>

      <ConfettiEffect />

      {/* Floating decorative elements */}
      {showAnimation && isClient && (
        <>
          <div className="fixed top-10 left-10 text-yellow-400 animate-float z-0">
            <Sparkles size={24} />
          </div>
          <div className="fixed top-20 right-10 text-blue-400 animate-float z-0" style={{ animationDelay: '1s' }}>
            <Sparkles size={20} />
          </div>
          <div className="fixed bottom-20 left-1/4 text-emerald-400 animate-float z-0" style={{ animationDelay: '2s' }}>
            <Sparkles size={18} />
          </div>
        </>
      )}

      <div className="max-w-4xl mx-auto relative z-20">
        {/* Success Header */}
        <div className="relative mb-8 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-2xl shadow-emerald-200 animate-scale-in animate-pulse-glow">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">
              Order Confirmed!
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-lg mx-auto animate-scale-in" style={{ animationDelay: '0.4s' }}>
            Thank you for your purchase. Your order #{orderId} has been successfully placed.
          </p>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full w-fit mx-auto animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <CheckCircle size={16} />
            <span>Payment confirmed • Email sent • Processing order</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Main Success Card */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-2xl shadow-blue-100/50 border border-blue-50 overflow-hidden transform transition-transform duration-300 hover:shadow-2xl">
            <div className="p-6 md:p-8">
              {/* Order Summary */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Package className="text-blue-600" size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="text-lg font-bold text-gray-900 tracking-wide">{orderId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">
                        {isClient ? currentDate : "Loading..."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                      <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                      <div className="flex items-center gap-2">
                        <CreditCard className="text-gray-400" size={16} />
                        <p className="font-medium text-gray-900">Credit Card</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                      <p className="text-sm text-gray-600 mb-1">Shipping Method</p>
                      <div className="flex items-center gap-2">
                        <Truck className="text-gray-400" size={16} />
                        <p className="font-medium text-gray-900">Standard (2-3 days)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
                  
                  <div className="space-y-6">
                    {[
                      { 
                        icon: CheckCircle, 
                        color: "emerald", 
                        title: "Order Placed", 
                        status: "Complete", 
                        active: true,
                        time: "Just now"
                      },
                      { 
                        icon: Clock, 
                        color: "blue", 
                        title: "Processing", 
                        status: "In Progress", 
                        active: true,
                        time: "Today"
                      },
                      { 
                        icon: Truck, 
                        color: "gray", 
                        title: "Shipped", 
                        status: "Upcoming", 
                        active: false,
                        time: "Tomorrow"
                      },
                      { 
                        icon: Home, 
                        color: "gray", 
                        title: "Delivered", 
                        status: "Upcoming", 
                        active: false,
                        time: "2-3 days"
                      }
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                          ${step.active 
                            ? `bg-${step.color}-100 text-${step.color}-600 group-hover:scale-110 transition-transform duration-300` 
                            : 'bg-gray-100 text-gray-400'
                          }`}>
                          <step.icon size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-medium ${step.active ? 'text-gray-800' : 'text-gray-500'} group-hover:text-gray-900 transition-colors`}>
                                {step.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">{step.time}</p>
                            </div>
                            <span className={`text-sm px-3 py-1 rounded-full 
                              ${step.status === 'Complete' ? 'bg-emerald-50 text-emerald-600' :
                                step.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                'bg-gray-100 text-gray-500'}`}>
                              {step.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href={`/orders/${orderId}`}
                    className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-4 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    View Order Details
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </Link>

                  <Link
                    href="/shop"
                    className="group flex items-center justify-center gap-3 rounded-xl border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 px-6 py-4 text-gray-700 hover:text-blue-600 font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    <Home size={18} />
                    Continue Shopping
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    onClick={handleDownloadReceipt}
                    className="group flex items-center justify-center gap-3 rounded-xl border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    <Download size={16} />
                    Download Receipt
                  </button>
                  <button 
                    onClick={handleEmailReceipt}
                    className="group flex items-center justify-center gap-3 rounded-xl border-2 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 px-4 py-3 text-gray-700 hover:text-emerald-600 font-semibold hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    <Mail size={16} />
                    Email Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Support Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-50 overflow-hidden transform transition-transform duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="text-blue-600" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Need Help?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is available 24/7 to assist you with any questions about your order.
                </p>
                <button 
                  onClick={handleContactSupport}
                  className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-3 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 active:scale-95"
                >
                  Contact Support
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 overflow-hidden transform transition-transform duration-300 hover:shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/orders"
                    className="group flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-blue-50 border border-blue-100 hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                      <ClipboardList className="text-blue-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">View All Orders</p>
                      <p className="text-sm text-gray-500">Track and manage your orders</p>
                    </div>
                    <ExternalLink className="text-gray-400 group-hover:text-blue-600" size={16} />
                  </Link>
                  
                  <Link
                    href="/account"
                    className="group flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-blue-50 border border-blue-100 hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors duration-300">
                      <CheckCircle className="text-emerald-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">Account Settings</p>
                      <p className="text-sm text-gray-500">Update your preferences</p>
                    </div>
                    <ExternalLink className="text-gray-400 group-hover:text-emerald-600" size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg shadow-emerald-100/50 border border-emerald-100 overflow-hidden transform transition-transform duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <Truck className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Delivery Updates</h3>
                    <p className="text-sm text-gray-600">We'll keep you posted</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 hover:bg-white/50 rounded-lg transition-colors duration-300">
                    <span className="text-sm text-gray-600">Estimated Delivery</span>
                    <span className="font-semibold text-gray-900">2-3 business days</span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-white/50 rounded-lg transition-colors duration-300">
                    <span className="text-sm text-gray-600">Tracking Number</span>
                    <span className="font-medium text-blue-600">Will be provided</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl shadow-blue-500/20 p-8 text-white transform transition-transform duration-300 hover:shadow-2xl">
          <form onSubmit={handleNewsletterSubscribe} className="max-w-lg mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Exclusive Offer</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Enjoy Your First Order?</h3>
            <p className="text-blue-100 mb-6">
              Subscribe to our newsletter and get 15% off your next purchase!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
              >
                Get 15% Off
              </button>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 text-sm text-gray-500 bg-gray-50 px-6 py-3 rounded-full mb-4">
            <span>Order ID: {orderId}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span suppressHydrationWarning>{isClient ? currentDate : "Loading..."}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-emerald-600 font-medium">✓ Confirmed</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            A confirmation email has been sent to your registered email address.
            You can track your order status anytime from the{" "}
            <Link href="/orders" className="text-blue-600 hover:text-blue-700 font-medium underline hover:no-underline transition-colors duration-300">
              My Orders
            </Link>{" "}
            section.
          </p>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/help" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300">
              Help Center
            </Link>
            <Link href="/shipping" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300">
              Shipping Policy
            </Link>
            <Link href="/returns" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300">
              Returns & Refunds
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}