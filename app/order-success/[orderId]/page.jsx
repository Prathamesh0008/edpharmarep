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
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../components/CartContext";
import Confetti from "react-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { jsPDF } from "jspdf"; // ADD THIS IMPORT FOR PDF GENERATION

export default function OrderSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const { t, language } = useLanguage();
  
  // FIXED: Since your folder is [orderId], use params.orderId
  const orderId = params.orderId;
  
  const { clearCart } = useCart();
  const [cartCleared, setCartCleared] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // ADD STATE FOR PAYMENT METHOD
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  // ADD STATE FOR ORDER DATA
  const [orderData, setOrderData] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);



  // Get translations from context, fallback to English
  const orderSuccessTranslations = t?.orderSuccessPage || {
    // ... (keep all your existing translations the same)
  };

useEffect(() => {
  console.log("=== ORDER SUCCESS DEBUG ===");
  console.log("Page params:", params);
  console.log("Order ID from params.orderId:", params.orderId);
  
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

  // Get order data and payment method
  if (typeof window !== 'undefined') {
    // Get email from URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlEmail = urlParams.get('email');
    
    // Get order data from localStorage or sessionStorage
    const storedOrderData = localStorage.getItem(`order_${orderId}`) || 
                           sessionStorage.getItem(`order_${orderId}`);
    
    if (storedOrderData) {
      try {
        const parsedData = JSON.parse(storedOrderData);
        setOrderData(parsedData);
        setPaymentMethod(parsedData.paymentMethod || "Cash on Delivery");
        setUserEmail(parsedData.customerEmail || urlEmail || "");
        console.log('Loaded order data:', parsedData);
      } catch (err) {
        console.error('Error parsing order data:', err);
      }
    } else {
      // Fallback: get from URL params
      const urlPayment = urlParams.get('payment');
      setPaymentMethod(urlPayment || "Cash on Delivery");
      setUserEmail(urlEmail || "");
    }
  }

  // Set loading to false
  const loadTimer = setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  // Hide confetti
  const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
  
  return () => {
    clearTimeout(loadTimer);
    clearTimeout(confettiTimer);
  };
}, [orderId, clearCart, cartCleared, router, params]); // Removed isClient

  // FIXED: Handle receipt download as PDF
  const handleDownloadReceipt = () => {
    if (!isClient) return;
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add company/order header
    doc.setFontSize(20);
    doc.setTextColor(33, 150, 243); // Blue color
    doc.text("ORDER CONFIRMATION", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Thank you for your purchase!", 105, 30, null, null, "center");
    
    // Add order details
    doc.setFontSize(10);
    let yPosition = 50;
    
    // Order ID
    doc.text(`Order ID: ${orderId}`, 20, yPosition);
    yPosition += 10;
    
    // Order Date
    doc.text(`Order Date: ${formatDate()}`, 20, yPosition);
    yPosition += 10;
    
    // Payment Method (FIXED: Use actual payment method)
    doc.text(`Payment Method: ${paymentMethod}`, 20, yPosition);
    yPosition += 10;
    
    // Delivery Method
    doc.text("Delivery: Standard (2-3 business days)", 20, yPosition);
    yPosition += 10;
    
    // Status
    doc.text("Status: Payment Confirmed - Order Processing", 20, yPosition);
    yPosition += 15;
    
    // Add a line separator
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 15;
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("If you have any questions about your order, please contact our", 105, yPosition, null, null, "center");
    yPosition += 5;
    doc.text("customer support at support@example.com or call (123) 456-7890", 105, yPosition, null, null, "center");
    
    // Save the PDF
    doc.save(`Order_${orderId}_Receipt.pdf`);
    
    // Show success message
    alert(orderSuccessTranslations.messages.receiptDownloaded);
  };

  // Handle email receipt
  const handleEmailReceipt = async () => {
  try {
    setIsSendingEmail(true);
    
    // Prepare email data
    const emailData = {
      orderId: orderId,
      customerEmail: orderData?.customerEmail || userEmail,
      customerName: orderData?.customerName || form?.fullName || 'Customer',
      totalAmount: orderData?.totalAmount || totals?.totalPrice || '0',
      paymentMethod: orderData?.paymentMethod || paymentMethod,
      items: orderData?.items || []
    };
    
    console.log('Sending email with data:', emailData);
    
    // Validate email
    if (!emailData.customerEmail) {
      alert('❌ Email address not found. Please contact support.');
      setIsSendingEmail(false);
      return;
    }
    
    // Call API to send email
    const response = await fetch('/api/send-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });
    
    const result = await response.json();
    console.log('Email API response:', result);
    
    if (result.success) {
      alert('✅ Receipt has been sent to your email!');
    } else {
      alert(`❌ Failed to send email: ${result.message}`);
      openFallbackEmail(emailData);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    alert('❌ Error sending email. Please try again or contact support.');
    
    // Fallback
    if (orderData || userEmail) {
      openFallbackEmail({
        orderId,
        customerEmail: orderData?.customerEmail || userEmail,
        customerName: orderData?.customerName || 'Customer',
      });
    }
  } finally {
    setIsSendingEmail(false);
  }
};
// Fallback email function
const openFallbackEmail = (data) => {
  const emailSubject = `Order Confirmation #${data.orderId} - EdPharma`;
  const emailBody = `Dear ${data.customerName},\n\nThank you for your order with EdPharma!\n\nOrder ID: ${data.orderId}\nDate: ${isClient ? formatDate() : new Date().toLocaleDateString()}\n\nYou can view your order details here:\n${typeof window !== 'undefined' ? window.location.origin : ''}/orders/${data.orderId}\n\nBest regards,\nEdPharma Team`;
  
  if (data.customerEmail) {
    window.location.href = `mailto:${data.customerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  } else {
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  }
};

  // Format date
  const formatDate = () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    // Return localized date based on current language
    return new Date().toLocaleDateString(language === 'en' ? 'en-US' : language, options);
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {orderSuccessTranslations.errorState.title}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              href="/orders"
              className="block w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {orderSuccessTranslations.errorState.viewOrders}
            </Link>
            <Link
              href="/"
              className="block w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              {orderSuccessTranslations.errorState.returnHome}
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
            {orderSuccessTranslations.loadingState.title}
          </h2>
          <p className="text-gray-600">
            {orderSuccessTranslations.loadingState.subtitle}
          </p>
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
            {orderSuccessTranslations.header.title}
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            {orderSuccessTranslations.header.subtitle.replace('{orderId}', orderId)}
          </p>
          
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
            <CheckCircle size={14} />
            <span>{orderSuccessTranslations.header.paymentStatus}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {orderSuccessTranslations.orderSummary.title}
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {orderSuccessTranslations.orderSummary.orderNumber}
                      </p>
                      <p className="text-lg font-bold text-gray-900">{orderId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {orderSuccessTranslations.orderSummary.orderDate}
                    </p>
                    <p className="font-medium text-gray-900">
                      {isClient ? formatDate() : "Loading..."}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        {orderSuccessTranslations.orderSummary.paymentMethod}
                      </p>
                    </div>
                    {/* FIXED: Display actual payment method instead of hardcoded text */}
                    <p className="font-medium text-gray-900">
                      {paymentMethod}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        {orderSuccessTranslations.orderSummary.delivery}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {orderSuccessTranslations.orderSummary.standardDelivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {orderSuccessTranslations.orderStatus.title}
              </h3>
              
              <div className="space-y-6">
                {[
                  { 
                    icon: CheckCircle, 
                    ...orderSuccessTranslations.orderStatus.steps.placed,
                    status: "complete"
                  },
                  { 
                    icon: Clock, 
                    ...orderSuccessTranslations.orderStatus.steps.processing,
                    status: "current"
                  },
                  { 
                    icon: Truck, 
                    ...orderSuccessTranslations.orderStatus.steps.shipping,
                    status: "pending"
                  },
                  { 
                    icon: Home, 
                    ...orderSuccessTranslations.orderStatus.steps.delivered,
                    status: "pending"
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
                            {orderSuccessTranslations.orderStatus.statuses.complete}
                          </span>
                        )}
                        {step.status === 'current' && (
                          <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-full">
                            {orderSuccessTranslations.orderStatus.statuses.inProgress}
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
                {orderSuccessTranslations.actionButtons.viewDetails}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products"
                className="group flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                {orderSuccessTranslations.actionButtons.continueShopping}
              </Link>

              <button
                onClick={handleDownloadReceipt}
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                {orderSuccessTranslations.actionButtons.downloadReceipt}
              </button>

              <button
  onClick={handleEmailReceipt}
  disabled={isSendingEmail}
  className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSendingEmail ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      Sending Email...
    </>
  ) : (
    <>
      <Mail className="w-4 h-4" />
      {orderSuccessTranslations.actionButtons.emailReceipt}
    </>
  )}
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
                <h3 className="font-semibold text-gray-900">
                  {orderSuccessTranslations.supportCard.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {orderSuccessTranslations.supportCard.description}
              </p>
              <Link
                href="/contact"
                className="block text-center text-blue-600 hover:text-blue-700 font-medium py-3 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                {orderSuccessTranslations.supportCard.contactSupport}
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {orderSuccessTranslations.quickActions.title}
              </h3>
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    <span className="text-gray-700 group-hover:text-blue-600">
                      {orderSuccessTranslations.quickActions.viewAllOrders}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
                </Link>
                
                <Link
                  href="/profile"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                    <span className="text-gray-700 group-hover:text-emerald-600">
                      {orderSuccessTranslations.quickActions.accountSettings}
                    </span>
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
                  <h3 className="font-semibold text-gray-900">
                    {orderSuccessTranslations.deliveryInfo.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {orderSuccessTranslations.deliveryInfo.subtitle}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 hover:bg-white/50 rounded-lg transition-colors">
                  <span className="text-sm text-gray-600">
                    {orderSuccessTranslations.deliveryInfo.estimatedDelivery}
                  </span>
                  <span className="font-semibold text-gray-900">2-3 business days</span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-white/50 rounded-lg transition-colors">
                  <span className="text-sm text-gray-600">
                    {orderSuccessTranslations.deliveryInfo.trackingNumber}
                  </span>
                  <span className="font-medium text-blue-600">
                    {orderSuccessTranslations.deliveryInfo.willBeProvided}
                  </span>
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
            <span className="text-emerald-600 font-medium">
              {orderSuccessTranslations.footer.confirmed}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto">
            {orderSuccessTranslations.footer.confirmationMessage.replace('My Orders', 
              <Link href="/orders" className="text-blue-600 hover:text-blue-700 font-medium underline hover:no-underline">
                {orderSuccessTranslations.quickActions.viewAllOrders}
              </Link>
            )}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <Link href="/help" className="hover:text-gray-700 transition-colors">
              {orderSuccessTranslations.footer.links.helpCenter}
            </Link>
            <Link href="/shipping" className="hover:text-gray-700 transition-colors">
              {orderSuccessTranslations.footer.links.shippingPolicy}
            </Link>
            <Link href="/returns" className="hover:text-gray-700 transition-colors">
              {orderSuccessTranslations.footer.links.returnsRefunds}
            </Link>
            <Link href="/contact" className="hover:text-gray-700 transition-colors">
              {orderSuccessTranslations.footer.links.contactUs}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   CheckCircle,
//   Package,
//   ArrowRight,
//   Truck,
//   Shield,
//   Download,
//   Mail,
//   Clock,
//   Home,
//   CreditCard,
//   ChevronRight,
//   AlertCircle
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useCart } from "../../components/CartContext";
// import Confetti from "react-confetti";
// import { useLanguage } from "@/context/LanguageContext"; // ADD THIS IMPORT

// export default function OrderSuccessPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { t, language } = useLanguage(); // ADD LANGUAGE CONTEXT
  
//   // FIXED: Since your folder is [orderId], use params.orderId
//   const orderId = params.orderId;
  
//   const { clearCart } = useCart();
//   const [cartCleared, setCartCleared] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(true);
//   const [isClient, setIsClient] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Get translations from context, fallback to English
//   const orderSuccessTranslations = t?.orderSuccessPage || {
//     header: {
//       title: "Order Confirmed!",
//       subtitle: "Thank you for your purchase. We've received your order #{orderId} and it's being processed.",
//       paymentStatus: "Payment confirmed • Email sent • Processing order"
//     },
//     errorState: {
//       title: "Order Error",
//       viewOrders: "View My Orders",
//       returnHome: "Return to Home"
//     },
//     loadingState: {
//       title: "Loading Your Order...",
//       subtitle: "Preparing your order confirmation"
//     },
//     orderSummary: {
//       title: "Order Summary",
//       orderNumber: "Order Number",
//       orderDate: "Order Date",
//       paymentMethod: "Payment Method",
//       cashOnDelivery: "Cash on Delivery",
//       delivery: "Delivery",
//       standardDelivery: "Standard (2-3 days)"
//     },
//     orderStatus: {
//       title: "Order Status",
//       steps: {
//         placed: {
//           title: "Order Placed",
//           description: "Your order has been received",
//           time: "Just now"
//         },
//         processing: {
//           title: "Processing",
//           description: "We're preparing your items",
//           time: "Today"
//         },
//         shipping: {
//           title: "Shipping",
//           description: "Estimated delivery in 2-3 days",
//           time: "Tomorrow"
//         },
//         delivered: {
//           title: "Delivered",
//           description: "Will arrive at your doorstep",
//           time: "2-3 days"
//         }
//       },
//       statuses: {
//         complete: "Complete",
//         inProgress: "In Progress"
//       }
//     },
//     actionButtons: {
//       viewDetails: "View Order Details",
//       continueShopping: "Continue Shopping",
//       downloadReceipt: "Download Receipt",
//       emailReceipt: "Email Receipt"
//     },
//     supportCard: {
//       title: "Need Help?",
//       description: "Our support team is here to help with any questions about your order.",
//       contactSupport: "Contact Support"
//     },
//     quickActions: {
//       title: "Quick Actions",
//       viewAllOrders: "View All Orders",
//       accountSettings: "Account Settings"
//     },
//     deliveryInfo: {
//       title: "Delivery Updates",
//       subtitle: "We'll keep you posted",
//       estimatedDelivery: "Estimated Delivery",
//       trackingNumber: "Tracking Number",
//       willBeProvided: "Will be provided"
//     },
//     footer: {
//       confirmed: "✓ Confirmed",
//       confirmationMessage: "A confirmation email has been sent to your registered email address. You can track your order status anytime from the My Orders section.",
//       links: {
//         helpCenter: "Help Center",
//         shippingPolicy: "Shipping Policy",
//         returnsRefunds: "Returns & Refunds",
//         contactUs: "Contact Us"
//       }
//     },
//     messages: {
//       receiptDownloaded: "Receipt downloaded successfully!",
//       emailSubject: "Your Order Confirmation - {orderId}"
//     }
//   };

//   useEffect(() => {
//     console.log("=== ORDER SUCCESS DEBUG ===");
//     console.log("Page params:", params);
//     console.log("Order ID from params.orderId:", params.orderId);
//     console.log("Full URL:", window.location.href);
//     console.log("Pathname:", window.location.pathname);
//     console.log("=== END DEBUG ===");
    
//     setIsClient(true);
    
//     // If no order ID, show error
//     if (!orderId) {
//       console.error("No order ID found in URL");
//       setError("No order ID found. Please check your order.");
//       setIsLoading(false);
//       return;
//     }
    
//     // Clear cart only once
//     if (!cartCleared) {
//       try {
//         clearCart();
//         localStorage.removeItem("cart");
//         setCartCleared(true);
//         console.log("Cart cleared successfully");
//       } catch (err) {
//         console.error("Error clearing cart:", err);
//       }
//     }

//     // Set loading to false after component mounts
//     const loadTimer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1500);

//     // Hide confetti after 5 seconds
//     const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    
//     return () => {
//       clearTimeout(loadTimer);
//       clearTimeout(confettiTimer);
//     };
//   }, [orderId, clearCart, cartCleared, router, params]);

//   // Handle receipt download
//   const handleDownloadReceipt = () => {
//     alert(`${orderSuccessTranslations.messages.receiptDownloaded}`);
//   };

//   // Handle email receipt
//   const handleEmailReceipt = () => {
//     const emailSubject = orderSuccessTranslations.messages.emailSubject.replace('{orderId}', orderId);
//     const emailBody = `Thank you for your order!\n\nOrder ID: ${orderId}\nDate: ${isClient ? formatDate() : new Date().toLocaleDateString()}\n\nBest regards,\nYour Store Team`;
    
//     window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
//   };

//   // Format date
//   const formatDate = () => {
//     const options = {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     };
    
//     // Return localized date based on current language
//     return new Date().toLocaleDateString(language === 'en' ? 'en-US' : language, options);
//   };

//   // Show error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
//           <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
//             <AlertCircle className="w-8 h-8" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">
//             {orderSuccessTranslations.errorState.title}
//           </h1>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <div className="space-y-3">
//             <Link
//               href="/orders"
//               className="block w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               {orderSuccessTranslations.errorState.viewOrders}
//             </Link>
//             <Link
//               href="/"
//               className="block w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
//             >
//               {orderSuccessTranslations.errorState.returnHome}
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-4 animate-pulse">
//             <CheckCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             {orderSuccessTranslations.loadingState.title}
//           </h2>
//           <p className="text-gray-600">
//             {orderSuccessTranslations.loadingState.subtitle}
//           </p>
//           {orderId && (
//             <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 md:py-12">
//       {/* Confetti Effect */}
//       {showConfetti && isClient && (
//         <Confetti
//           recycle={false}
//           numberOfPieces={100}
//           gravity={0.1}
//           className="!fixed"
//         />
//       )}

//       <div className="max-w-4xl mx-auto">
//         {/* Success Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-6 shadow-lg shadow-emerald-200">
//             <CheckCircle className="w-10 h-10 text-white" strokeWidth={1.5} />
//           </div>
          
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
//             {orderSuccessTranslations.header.title}
//           </h1>
//           <p className="text-gray-600 max-w-md mx-auto">
//             {orderSuccessTranslations.header.subtitle.replace('{orderId}', orderId)}
//           </p>
          
//           <div className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
//             <CheckCircle size={14} />
//             <span>{orderSuccessTranslations.header.paymentStatus}</span>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6 mb-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Order Summary Card */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                 {orderSuccessTranslations.orderSummary.title}
//               </h2>
              
//               <div className="space-y-4">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-white rounded-lg shadow-sm">
//                       <Package className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">
//                         {orderSuccessTranslations.orderSummary.orderNumber}
//                       </p>
//                       <p className="text-lg font-bold text-gray-900">{orderId}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-500">
//                       {orderSuccessTranslations.orderSummary.orderDate}
//                     </p>
//                     <p className="font-medium text-gray-900">
//                       {isClient ? formatDate() : "Loading..."}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
//                     <div className="flex items-center gap-2 mb-2">
//                       <CreditCard className="w-4 h-4 text-gray-400" />
//                       <p className="text-sm text-gray-500">
//                         {orderSuccessTranslations.orderSummary.paymentMethod}
//                       </p>
//                     </div>
//                     <p className="font-medium text-gray-900">
//                       {orderSuccessTranslations.orderSummary.cashOnDelivery}
//                     </p>
//                   </div>
                  
//                   <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Truck className="w-4 h-4 text-gray-400" />
//                       <p className="text-sm text-gray-500">
//                         {orderSuccessTranslations.orderSummary.delivery}
//                       </p>
//                     </div>
//                     <p className="font-medium text-gray-900">
//                       {orderSuccessTranslations.orderSummary.standardDelivery}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Order Status */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6">
//                 {orderSuccessTranslations.orderStatus.title}
//               </h3>
              
//               <div className="space-y-6">
//                 {[
//                   { 
//                     icon: CheckCircle, 
//                     ...orderSuccessTranslations.orderStatus.steps.placed,
//                     status: "complete"
//                   },
//                   { 
//                     icon: Clock, 
//                     ...orderSuccessTranslations.orderStatus.steps.processing,
//                     status: "current"
//                   },
//                   { 
//                     icon: Truck, 
//                     ...orderSuccessTranslations.orderStatus.steps.shipping,
//                     status: "pending"
//                   },
//                   { 
//                     icon: Home, 
//                     ...orderSuccessTranslations.orderStatus.steps.delivered,
//                     status: "pending"
//                   }
//                 ].map((step, index) => (
//                   <div key={index} className="flex items-start gap-4">
//                     <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
//                       ${step.status === 'complete' ? 'bg-emerald-100 text-emerald-600' :
//                         step.status === 'current' ? 'bg-blue-100 text-blue-600' :
//                         'bg-gray-100 text-gray-400'}`}>
//                       <step.icon className="w-5 h-5" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="font-medium text-gray-900">{step.title}</p>
//                           <p className="text-sm text-gray-500 mt-1">{step.description}</p>
//                           <p className="text-xs text-gray-400 mt-1">{step.time}</p>
//                         </div>
//                         {step.status === 'complete' && (
//                           <span className="px-3 py-1 text-sm font-medium bg-emerald-50 text-emerald-600 rounded-full">
//                             {orderSuccessTranslations.orderStatus.statuses.complete}
//                           </span>
//                         )}
//                         {step.status === 'current' && (
//                           <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-full">
//                             {orderSuccessTranslations.orderStatus.statuses.inProgress}
//                           </span>
//                         )}
//                       </div>
//                       {index < 3 && (
//                         <div className="h-6 w-0.5 bg-gray-200 ml-5 mt-2"></div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="grid sm:grid-cols-2 gap-4">
//               <Link
//                 href={`/orders/${orderId}`}
//                 className="group flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 {orderSuccessTranslations.actionButtons.viewDetails}
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Link>

//               <Link
//                 href="/products"
//                 className="group flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
//               >
//                 <Home className="w-4 h-4" />
//                 {orderSuccessTranslations.actionButtons.continueShopping}
//               </Link>

//               <button
//                 onClick={handleDownloadReceipt}
//                 className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
//               >
//                 <Download className="w-4 h-4" />
//                 {orderSuccessTranslations.actionButtons.downloadReceipt}
//               </button>

//               <button
//                 onClick={handleEmailReceipt}
//                 className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
//               >
//                 <Mail className="w-4 h-4" />
//                 {orderSuccessTranslations.actionButtons.emailReceipt}
//               </button>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Support Card */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <Shield className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900">
//                   {orderSuccessTranslations.supportCard.title}
//                 </h3>
//               </div>
//               <p className="text-sm text-gray-600 mb-4">
//                 {orderSuccessTranslations.supportCard.description}
//               </p>
//               <Link
//                 href="/contact"
//                 className="block text-center text-blue-600 hover:text-blue-700 font-medium py-3 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
//               >
//                 {orderSuccessTranslations.supportCard.contactSupport}
//               </Link>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="font-semibold text-gray-900 mb-4">
//                 {orderSuccessTranslations.quickActions.title}
//               </h3>
//               <div className="space-y-3">
//                 <Link
//                   href="/orders"
//                   className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
//                 >
//                   <div className="flex items-center gap-3">
//                     <Package className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
//                     <span className="text-gray-700 group-hover:text-blue-600">
//                       {orderSuccessTranslations.quickActions.viewAllOrders}
//                     </span>
//                   </div>
//                   <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
//                 </Link>
                
//                 <Link
//                   href="/profile"
//                   className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group"
//                 >
//                   <div className="flex items-center gap-3">
//                     <CheckCircle className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
//                     <span className="text-gray-700 group-hover:text-emerald-600">
//                       {orderSuccessTranslations.quickActions.accountSettings}
//                     </span>
//                   </div>
//                   <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600" />
//                 </Link>
//               </div>
//             </div>

//             {/* Delivery Info */}
//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-blue-100 rounded-full">
//                   <Truck className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">
//                     {orderSuccessTranslations.deliveryInfo.title}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     {orderSuccessTranslations.deliveryInfo.subtitle}
//                   </p>
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center p-2 hover:bg-white/50 rounded-lg transition-colors">
//                   <span className="text-sm text-gray-600">
//                     {orderSuccessTranslations.deliveryInfo.estimatedDelivery}
//                   </span>
//                   <span className="font-semibold text-gray-900">2-3 business days</span>
//                 </div>
//                 <div className="flex justify-between items-center p-2 hover:bg-white/50 rounded-lg transition-colors">
//                   <span className="text-sm text-gray-600">
//                     {orderSuccessTranslations.deliveryInfo.trackingNumber}
//                   </span>
//                   <span className="font-medium text-blue-600">
//                     {orderSuccessTranslations.deliveryInfo.willBeProvided}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center">
//           <div className="inline-flex items-center gap-4 text-sm text-gray-500 bg-gray-50 px-6 py-3 rounded-full mb-4">
//             <span>Order ID: {orderId}</span>
//             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//             <span>{isClient ? formatDate() : "Loading..."}</span>
//             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//             <span className="text-emerald-600 font-medium">
//               {orderSuccessTranslations.footer.confirmed}
//             </span>
//           </div>
          
//           <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto">
//             {orderSuccessTranslations.footer.confirmationMessage.replace('My Orders', 
//               <Link href="/orders" className="text-blue-600 hover:text-blue-700 font-medium underline hover:no-underline">
//                 {orderSuccessTranslations.quickActions.viewAllOrders}
//               </Link>
//             )}
//           </p>
          
//           <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
//             <Link href="/help" className="hover:text-gray-700 transition-colors">
//               {orderSuccessTranslations.footer.links.helpCenter}
//             </Link>
//             <Link href="/shipping" className="hover:text-gray-700 transition-colors">
//               {orderSuccessTranslations.footer.links.shippingPolicy}
//             </Link>
//             <Link href="/returns" className="hover:text-gray-700 transition-colors">
//               {orderSuccessTranslations.footer.links.returnsRefunds}
//             </Link>
//             <Link href="/contact" className="hover:text-gray-700 transition-colors">
//               {orderSuccessTranslations.footer.links.contactUs}
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }