//app\profile\page.jsx

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// --- ICONS (SVG Components for cleaner code) ---
const Icons = {
  User: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Shield: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ),
  Map: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Logout: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
  Camera: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  Edit: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    street: "",
    city: "",
    pincode: "",
    mobile: "",
    gender: "",
  });

  const [pwd, setPwd] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const calculateProfileCompletion = () => {
    const fields = [
      profile.username,
      profile.email,
      profile.mobile,
      profile.gender,
      profile.street,
      profile.city,
      profile.pincode,
    ];

    const total = fields.length;
    const filled = fields.filter((v) => v && v.trim() !== "").length;

    return Math.round((filled / total) * 100);
  };

  // ✅ profile strength values
  const completion = calculateProfileCompletion();
  const isComplete = completion === 100;

  // ✅ FIRST: function declare करा
const loadUserData = (email) => {
  fetch(`/api/auth?email=${encodeURIComponent(email)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.user) {
        setProfile({
          username: data.user.username || "",
          email: data.user.email || "",
          street: data.user.street || "",
          city: data.user.city || "",
          pincode: data.user.pincode || "",
          mobile: data.user.mobile || "",
          gender: data.user.gender || "",
        });
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));
};

// ✅ THEN: useEffect
useEffect(() => {
  const stored = localStorage.getItem("bio-user");
  if (!stored) {
    router.push("/");
    return;
  }

  const user = JSON.parse(stored);
  setUsername(user.username);
  loadUserData(user.email);
}, [router]);


  const handleLogout = () => {
    localStorage.removeItem("bio-user");
    router.push("/");
  };

  const saveProfile = async () => {
    setMessage("Processing...");

    try {
      const res = await fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  email: profile.email,        // ✅ identifier
  username: profile.username,
  street: profile.street,
  city: profile.city,
  pincode: profile.pincode,
  mobile: profile.mobile,
  gender: profile.gender,
}),

      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage("Error: " + (data.message || "Failed to save."));
        return;
      }

      if (data.user?.username) {
        // ✅ update localStorage bio-user after profile save
        const stored = localStorage.getItem("bio-user");
        if (stored) {
          const u = JSON.parse(stored);

          u.username = data.user.username;
          u.email = data.user.email;

          localStorage.setItem("bio-user", JSON.stringify(u));
        }

        // update local state
        setUsername(data.user.username);
      }

      setProfile({
  username: data.user.username || "",
  email: data.user.email || "",
  street: data.user.street || "",
  city: data.user.city || "",
  pincode: data.user.pincode || "",
  mobile: data.user.mobile || "",
  gender: data.user.gender || "",
});


      setMessage("Success: Profile updated!");
      setIsEditing(false);
    } catch (err) {
      setMessage("Error: Server connection failed.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const changePassword = async () => {
    setMessage("Processing...");

    if (!pwd.currentPassword || !pwd.newPassword || !pwd.confirmNewPassword) {
      setMessage("Error: Fill all password fields.");
      return;
    }

    if (pwd.newPassword !== pwd.confirmNewPassword) {
      setMessage("Error: New passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email, // ✅ user identify
          currentPassword: pwd.currentPassword,
          newPassword: pwd.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage("Error: " + (data.message || "Failed"));
        return;
      }

      // clear fields
      setPwd({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setMessage("Success: Password updated!");
    } catch (err) {
      setMessage("Error: Server connection failed.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#222d63] mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-800">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#222d63] to-[#4181af]"></div>
            <span className="font-bold text-slate-800">Profile Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Icons.Logout />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center sm:text-left">
            Account Settings
          </h1>

          <p className="text-slate-600 mt-2 text-sm sm:text-base text-center sm:text-left">
            Manage your profile information and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#222d63] to-[#4181af] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {profile.username
                      ? profile.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
                    <Icons.Camera />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  {profile.username || "Guest User"}
                </h2>
                <p className="text-slate-500 text-sm mt-1">{profile.email}</p>

                <div className="mt-6 flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Verified Account
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full flex items-center gap-3 px-4 py-4 text-left border-b border-slate-100 transition-colors ${
                  activeTab === "general"
                    ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-500"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    activeTab === "general" ? "bg-blue-100" : "bg-slate-100"
                  }`}
                >
                  <Icons.User />
                </div>
                <div>
                  <div className="font-medium">General</div>
                  <div className="text-xs text-slate-500">
                    Personal information
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${
                  activeTab === "security"
                    ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-500"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    activeTab === "security" ? "bg-blue-100" : "bg-slate-100"
                  }`}
                >
                  <Icons.Shield />
                </div>
                <div>
                  <div className="font-medium">Security</div>
                  <div className="text-xs text-slate-500">
                    Password & security
                  </div>
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-[#222d63] to-[#4181af] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Profile Strength</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Completeness</span>
                  <span className="font-bold">{completion}%</span>
                </div>

                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className={
                      "h-full rounded-full transition-all duration-500 " +
                      (isComplete
                        ? "bg-green-400"
                        : "bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300")
                    }
                    style={{ width: `${completion}%` }}
                  />
                </div>

                <div className="text-xs opacity-90 mt-2">
                  {isComplete
                    ? "Profile completed successfully 🎉"
                    : "Complete your profile for better experience"}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Tab Header */}
              <div className="border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center sm:text-left">
                      {activeTab === "general"
                        ? "Personal Information"
                        : "Security Settings"}
                    </h2>

                    <p className="text-slate-600 mt-1 text-sm sm:text-base">
                      {activeTab === "general"
                        ? "Update your personal details and contact information"
                        : "Manage your password and account security"}
                    </p>
                  </div>
                  {activeTab === "general" && (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Icons.Edit />
                      {isEditing ? "Cancel Edit" : "Edit Profile"}
                    </button>
                  )}
                </div>
              </div>

              {/* Message Alert */}
              {message && (
                <div
                  className={`mx-8 mt-6 px-4 py-3 rounded-lg flex items-center gap-2 ${
                    message.includes("Error")
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : "bg-green-50 text-green-700 border border-green-100"
                  }`}
                >
                  {!message.includes("Error") && <Icons.Check />}
                  <span className="font-medium">{message}</span>
                </div>
              )}

              {/* Tab Content */}
              <div className="p-4 sm:p-8">
                {activeTab === "general" ? (
                  <div className="space-y-8">
                    {/* Basic Info Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <h3 className="font-semibold text-slate-800">
                          Basic Information
                        </h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profile.username}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                username: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              isEditing
                                ? "border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                : "border-slate-200 bg-slate-50"
                            } transition-colors outline-none`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              isEditing
                                ? "border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                : "border-slate-200 bg-slate-50"
                            } transition-colors outline-none`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <h3 className="font-semibold text-slate-800">
                          Contact Information
                        </h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profile.mobile}
                            onChange={(e) =>
                              setProfile({ ...profile, mobile: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              isEditing
                                ? "border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                : "border-slate-200 bg-slate-50"
                            } transition-colors outline-none`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Gender
                          </label>
                          <select
                            value={profile.gender}
                            onChange={(e) =>
                              setProfile({ ...profile, gender: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              isEditing
                                ? "border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                : "border-slate-200 bg-slate-50"
                            } transition-colors outline-none`}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <h3 className="font-semibold text-slate-800">
                          Address Details
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={profile.street}
                            onChange={(e) =>
                              setProfile({ ...profile, street: e.target.value })
                            }
                            disabled={!isEditing}
                            placeholder="Enter your street address"
                            className={`w-full px-4 py-3 rounded-lg border ${
                              isEditing
                                ? "border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                : "border-slate-200 bg-slate-50"
                            } transition-colors outline-none`}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              City
                            </label>
                            <input
                              type="text"
                              value={profile.city}
                              onChange={(e) =>
                                setProfile({ ...profile, city: e.target.value })
                              }
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 rounded-lg border ${
                                isEditing
                                  ? "border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                  : "border-slate-200 bg-slate-50"
                              } transition-colors outline-none`}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              Pincode
                            </label>
                            <input
                              type="text"
                              value={profile.pincode}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  pincode: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className={`w-full px-4 py-3 rounded-lg border ${
                                isEditing
                                  ? "border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                  : "border-slate-200 bg-slate-50"
                              } transition-colors outline-none`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                      <div className="pt-6 border-t border-slate-200">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveProfile}
                            className="px-6 py-3 bg-gradient-to-r from-[#222d63] to-[#4181af] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Password Change Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <h3 className="font-semibold text-slate-800">
                          Change Password
                        </h3>
                      </div>

                      <div className="max-w-md space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={pwd.currentPassword}
                            onChange={(e) =>
                              setPwd({
                                ...pwd,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder="Enter current password"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={pwd.newPassword}
                            onChange={(e) =>
                              setPwd({ ...pwd, newPassword: e.target.value })
                            }
                            placeholder="Enter new password"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={pwd.confirmNewPassword}
                            onChange={(e) =>
                              setPwd({
                                ...pwd,
                                confirmNewPassword: e.target.value,
                              })
                            }
                            placeholder="Confirm new password"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Update Button */}
                    <div className="pt-6 border-t border-slate-200">
                      <button
                        onClick={changePassword}
                        className="px-6 py-3 bg-gradient-to-r from-[#222d63] to-[#4181af] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
