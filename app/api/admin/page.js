"use client";

import Topbar from "../../components/admin/Topbar";

import {
  Package,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* TOPBAR */}
      <Topbar />

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* PAGE TITLE */}
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Dashboard Overview
        </h1>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          <StatCard
            icon={Package}
            label="Total Orders"
            value="4"
            color="blue"
          />

          <StatCard
            icon={Clock}
            label="Pending Review"
            value="0"
            color="amber"
          />

          <StatCard
            icon={CheckCircle}
            label="Approved"
            value="1"
            color="green"
          />

          <StatCard
            icon={Truck}
            label="Shipped"
            value="1"
            color="purple"
          />

        </div>
      </main>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",

    // ✅ NEW COLORS ADDED (OPTIONAL USE)
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
    cyan: "bg-cyan-100 text-cyan-600",
    teal: "bg-teal-100 text-teal-600",
    pink: "bg-pink-100 text-pink-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          colors[color] || colors.blue
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div>
        <div className="text-sm text-slate-500">
          {label}
        </div>
        <div className="text-2xl font-bold text-slate-900">
          {value}
        </div>
      </div>
    </div>
  );
}
