"use client";

import {
  Menu,
  Bell,
  Package,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

export default function Topbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-3 min-w-[260px]">
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-900"
            onClick={onMenu}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />  
          </button>

          <div className="text-lg font-semibold text-slate-900 whitespace-nowrap">
            EdPharma Order Console
          </div>
        </div>

        {/* ================= STATUS CARDS (FIXED) ================= */}
        {/* ❌ hidden lg:flex → ✅ flex (icons will SHOW now) */}
        <div className="flex items-center gap-4">
          <StatusCard icon={Package} label="Total Orders" value="4" />
          <StatusCard icon={Clock} label="Pending Review" value="0" />
          <StatusCard icon={CheckCircle} label="Approved" value="1" />
          <StatusCard icon={Truck} label="Shipped" value="1" />
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-3 min-w-[200px] justify-end">
          <button
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-900"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

         <div className="flex items-center gap-4">

            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
              SA
            </div>

            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-semibold text-slate-900">
                Super Admin
              </div>
              <div className="text-xs text-slate-500">
                admin@edpharma.com
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

/* ================= STATUS CARD ================= */

function StatusCard({ icon: Icon, label, value }) {
  const styles = {
    "Total Orders": {
      bg: "bg-blue-100",
      icon: "text-blue-600",
    },
    "Pending Review": {
      bg: "bg-amber-100",
      icon: "text-amber-600",
    },
    "Approved": {
      bg: "bg-green-100",
      icon: "text-green-600",
    },
    "Shipped": {
      bg: "bg-purple-100",
      icon: "text-purple-600",
    },
  };

  const style = styles[label] || {
    bg: "bg-slate-100",
    icon: "text-slate-600",
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm min-w-[170px]">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${style.bg}`}
      >
        <Icon className={`w-5 h-5 ${style.icon}`} />
      </div>

      <div className="leading-tight">
        <div className="text-xs text-slate-500">
          {label}
        </div>
        <div className="text-lg font-semibold text-slate-900">
          {value}
        </div>
      </div>
    </div>
  );
}