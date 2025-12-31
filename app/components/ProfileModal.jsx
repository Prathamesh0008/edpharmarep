"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";


export default function ProfileModal({ isOpen, onClose, username, onUserUpdated, onLogout }) {
  const [message, setMessage] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false); // Toggle state

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    address: "",
  });

  const [pwd, setPwd] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Keep existing logic: Try to find user in localStorage first
  const currentUser = useMemo(() => {
    if (typeof window !== "undefined") {
      const users = JSON.parse(localStorage.getItem("ed_users") || "[]");
      return users.find((u) => u.username === username) || null;
    }
    return null;
  }, [username, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setMessage("");
    setShowPasswordFields(false); // Reset to hidden when opening
    setPwd({ currentPassword: "", newPassword: "", confirmNewPassword: "" });

    // 1. Initialize with whatever we have locally (or blank)
    if (currentUser) {
      setProfile({
        username: currentUser.username || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
      });
    } else {
      setProfile({ username: username || "", email: "", address: "" });
    }

    // 2. NEW: Fetch fresh data from MongoDB if we have a username
    // This ensures email/address appear even if localStorage is empty
    if (username) {
      fetch(`/api/auth?username=${encodeURIComponent(username)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setProfile((prev) => ({
              ...prev,
              email: data.user.email || prev.email,
              address: data.user.address || prev.address,
              // We don't overwrite username to avoid UI flicker
            }));
          }
        })
        .catch((err) => console.log("Profile fetch skipped (offline mode)", err));
    }
  }, [isOpen, currentUser, username]);

  if (!isOpen) return null;
  if (typeof window === "undefined") return null;


  const saveProfile = () => {
    setMessage("Processing...");
    // Keep your existing localStorage logic for "offline" updates
    const users = JSON.parse(localStorage.getItem("ed_users") || "[]");
    const idx = users.findIndex((u) => u.username === username);

    // Note: Since we moved to MongoDB, this localStorage update is just a client-side fallback.
    // Real persistence requires a PUT/PATCH API endpoint.
    if (idx !== -1) {
       users[idx] = {
        ...users[idx],
        username: profile.username,
        email: profile.email,
        address: profile.address,
      };
      localStorage.setItem("ed_users", JSON.stringify(users));
    }

    if (profile.username !== username) {
      localStorage.setItem("username", profile.username);
      onUserUpdated?.(profile.username);
    }
    setMessage("Profile updated (Client-side only).");
  };

  const changePassword = () => {
    setMessage("Processing...");
    // Keep existing password logic
    const users = JSON.parse(localStorage.getItem("ed_users") || "[]");
    const idx = users.findIndex((u) => u.username === username);

       // If user is not in localStorage, they are a Cloud/MongoDB user
    if (idx === -1) {
      fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          currentPassword: pwd.currentPassword,
          newPassword: pwd.newPassword,
        }),
      })
      .then(async (res) => {
        const data = await res.json();
        if (data.success) {
          setMessage("Password updated successfully!");
          setPwd({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
          setShowPasswordFields(false);
        } else {
          setMessage(data.message || "Failed to update password");
        }
      })
      .catch(() => setMessage("Server error. Please try again."));
      
      return; // Stop here so we don't run the localStorage code below
    }


    if (!pwd.currentPassword || !pwd.newPassword || !pwd.confirmNewPassword) {
      setMessage("Fill all password fields.");
      return;
    }
    
    // Note: This checks localStorage password, not DB password.
    if (users[idx].password !== pwd.currentPassword) {
      setMessage("Current password incorrect.");
      return;
    }

    if (pwd.newPassword !== pwd.confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    users[idx] = { ...users[idx], password: pwd.newPassword };
    localStorage.setItem("ed_users", JSON.stringify(users));

    setPwd({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    setMessage("Password updated (Client-side only).");
    setShowPasswordFields(false); // Hide fields after success
  };

  return createPortal(
  <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm p-4">
       {/* Container */}
    <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto
      fixed top-1/2 left-1/2
      -translate-x-1/2 -translate-y-1/2
      animate-fadeIn"
    >
        
        {/* Header */}
      <div className="bg-[#2f609b] p-4 flex justify-between items-center text-white">
        <h2 className="text-lg font-bold tracking-wide">My Profile</h2>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white text-2xl leading-none transition-colors"
        >
          &times;
        </button>
      </div>

        <div className="p-6 space-y-5">
          {/* User Details Section */}
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
              <input
                type="text"
                value={profile.username}
                className="w-full p-2 border-b border-gray-200 text-sm font-medium text-gray-800 focus:border-[#2f609b] focus:bg-blue-50/30 outline-none transition-all"
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
              <input
                type="email"
                value={profile.email}
                className="w-full p-2 border-b border-gray-200 text-sm font-medium text-gray-800 focus:border-[#2f609b] focus:bg-blue-50/30 outline-none transition-all"
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Address</label>
              <input
                type="text"
                placeholder="Add your address"
                value={profile.address}
                className="w-full p-2 border-b border-gray-200 text-sm font-medium text-gray-800 focus:border-[#2f609b] focus:bg-blue-50/30 outline-none transition-all placeholder:text-gray-300"
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>

            <button
              onClick={saveProfile}
              className="mt-2 w-full bg-[#2f609b] text-white py-2 rounded text-sm font-semibold hover:bg-[#1a3a63] transition-colors shadow-sm"
            >
              Save Details
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* Password Toggle Section */}
          <div className="space-y-3">
            {!showPasswordFields ? (
              <button
                onClick={() => setShowPasswordFields(true)}
                className="w-full border border-gray-300 text-gray-600 py-2 rounded text-sm font-medium hover:border-[#2f609b] hover:text-[#2f609b] transition-all"
              >
                Change Password
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 animate-fadeIn">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-bold text-[#2f609b] uppercase">New Password</h3>
                  <button 
                    onClick={() => setShowPasswordFields(false)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
                
                <input
                  type="password"
                  placeholder="Current Password"
                  value={pwd.currentPassword}
                  className="w-full p-2 bg-white border border-gray-200 rounded text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#2f609b]"
                  onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={pwd.newPassword}
                  className="w-full p-2 bg-white border border-gray-200 rounded text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#2f609b]"
                  onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={pwd.confirmNewPassword}
                  className="w-full p-2 bg-white border border-gray-200 rounded text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#2f609b]"
                  onChange={(e) => setPwd({ ...pwd, confirmNewPassword: e.target.value })}
                />
                
                <button
                  onClick={changePassword}
                  className="w-full bg-[#2f609b] text-white py-2 rounded text-sm font-semibold hover:bg-[#1a3a63] transition-all shadow-sm"
                >
                  Update Password
                </button>
              </div>
            )}
          </div>

          {/* Logout Link */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                onClose();
                onLogout?.();
              }}
              className="text-red-500 text-sm font-medium hover:text-red-700 hover:underline transition-all"
            >
              Sign Out
            </button>
          </div>

          {/* Feedback Message */}
          {message && (
            <p className="text-center text-xs font-bold text-[#2f609b] bg-blue-50 py-2 rounded">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>,
      document.body
  );
}