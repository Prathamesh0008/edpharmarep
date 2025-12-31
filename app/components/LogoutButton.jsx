"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      className="flex items-center gap-3 px-4 py-3 rounded-lg
                 text-red-600 hover:bg-red-50 transition"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
}