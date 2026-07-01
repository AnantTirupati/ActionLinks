"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { ProgressBar } from "@/components/ui/progress-bar";
import { apiKeys as initialApiKeys, notificationPreferences as initialPrefs } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  User,
  Shield,
  Key,
  Plus,
  Trash2,
  Settings as PrefIcon,
  CreditCard,
  Bell,
  Camera,
  CheckCircle,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const supabase = createClient();
  const [keys, setKeys] = useState(initialApiKeys);
  const [prefs, setPrefs] = useState(initialPrefs);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.user_metadata?.full_name || "");
        setEmail(currentUser.email || "");
        setBio(currentUser.user_metadata?.bio || "");
      }
    }
    loadUser();
  }, []);

  const handleSaveChanges = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        email: email !== user?.email ? email : undefined,
        data: {
          full_name: name,
          bio: bio,
        },
      });
      if (error) {
        setMessage({ text: error.message, type: "error" });
      } else {
        setMessage({ text: "Profile updated successfully!", type: "success" });
      }
    } catch (err) {
      setMessage({ text: "An error occurred while saving changes.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Settings", href: "/settings" },
    { label: "Profile" },
  ];

  const handleTogglePref = (id: string) => {
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleGenerateKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      name: `Generated Key ${keys.length + 1}`,
      token: `sk_live_...${Math.random().toString(36).substring(2, 6)}`,
      createdAt: "Today",
    };
    setKeys((prev) => [...prev, newKey]);
  };

  const handleDeleteKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-display text-on-surface font-black">
          Profile Settings
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Manage your account preferences, security, and billing details.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Column: User Info, Security, API Keys */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* User Information */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-headline-md font-bold text-on-surface">
                User Information
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-outline-variant relative group cursor-pointer">
                  <Image
                    src={user?.user_metadata?.avatar_url || "/images/image_26.png"}
                    alt={name || "User"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <button className="text-primary text-label-sm hover:underline font-medium">
                  Change Photo
                </button>
              </div>

              {/* Form Inputs */}
              <div className="flex-grow flex flex-col gap-4">
                {message && (
                  <div
                    className={`p-3 rounded-md text-body-sm font-medium ${
                      message.type === "success"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-error-container text-on-error-container"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-label-sm text-on-surface-variant font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-label-sm text-on-surface-variant font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm text-on-surface-variant font-medium">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={loading}
                    rows={3}
                    className="bg-surface border border-outline-variant rounded-md p-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none transition-all disabled:opacity-50"
                  />
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="bg-primary-container text-on-primary text-label-md px-4 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-headline-md font-bold text-on-surface">
                Security
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm text-on-surface-variant font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="hidden sm:block" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm text-on-surface-variant font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm text-on-surface-variant font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-start border-b border-outline-variant/40 pb-5 mb-2 mt-2">
                <button className="bg-surface border border-outline-variant text-on-surface text-label-md px-4 py-2 rounded hover:bg-surface-container-low transition-colors">
                  Update Password
                </button>
              </div>

              {/* 2FA Panel */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-label-md font-semibold text-on-surface">
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-body-md text-on-surface-variant mt-0.5">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <span className="flex items-center gap-1 text-label-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Enabled
                </span>
              </div>
            </div>
          </section>

          {/* API Keys */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                <h2 className="text-headline-md font-bold text-on-surface">
                  API Keys
                </h2>
              </div>
              <button
                onClick={handleGenerateKey}
                className="bg-primary-container text-on-primary text-label-sm px-3 py-1.5 rounded-md flex items-center gap-1 hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" /> Generate New
              </button>
            </div>
            
            <p className="text-body-md text-on-surface-variant">
              Manage keys for external integrations. Keep these tokens secure.
            </p>

            <div className="border border-outline-variant rounded-lg overflow-hidden mt-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-outline-variant font-semibold text-label-sm text-on-surface-variant">
                    <th className="py-2.5 px-4">Key Name</th>
                    <th className="py-2.5 px-4">Token</th>
                    <th className="py-2.5 px-4">Created</th>
                    <th className="py-2.5 px-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60">
                  {keys.map((key) => (
                    <tr key={key.id} className="hover:bg-surface/50 text-body-md">
                      <td className="py-3 px-4 font-medium text-on-surface">
                        {key.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-outline">
                        {key.token}
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">
                        {key.createdAt}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteKey(key.id)}
                          className="text-on-surface-variant hover:text-error transition-colors"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Billing, Notifications, Preferences */}
        <div className="flex flex-col gap-6">
          {/* Subscription Panel */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-headline-md font-bold text-on-surface">
                Subscription
              </h2>
            </div>

            <div>
              <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Current Plan
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[28px] font-black text-on-surface leading-none">
                  Premium SaaS
                </span>
                <span className="bg-secondary-container text-primary text-label-sm px-2 py-0.5 rounded-full border border-primary/20 font-bold">
                  Active
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant mt-2">
                Billed annually. Next invoice on Dec 1, 2026.
              </p>
            </div>

            {/* Billing limit details */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-body-md text-on-surface-variant">
                  <span>API Requests</span>
                  <span className="font-semibold text-on-surface">45k / 100k</span>
                </div>
                <ProgressBar value={45} />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-body-md text-on-surface-variant">
                  <span>Storage Used</span>
                  <span className="font-semibold text-on-surface">12GB / 50GB</span>
                </div>
                <ProgressBar value={24} />
              </div>
            </div>

            <button className="w-full mt-2 bg-surface border border-outline-variant text-on-surface py-2 rounded-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm font-semibold">
              Manage Billing
            </button>
          </section>

          {/* Notifications Preferences */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-headline-md font-bold text-on-surface">
                Notifications
              </h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {prefs.map((pref) => (
                <div
                  key={pref.id}
                  className="flex items-center justify-between"
                >
                  <div className="max-w-[80%]">
                    <h4 className="text-label-md font-semibold text-on-surface">
                      {pref.title}
                    </h4>
                    <p className="text-[12px] text-on-surface-variant leading-tight">
                      {pref.description}
                    </p>
                  </div>
                  
                  {/* Custom Toggle Switch */}
                  <button
                    onClick={() => handleTogglePref(pref.id)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 relative ${
                      pref.enabled ? "bg-primary" : "bg-surface-variant"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                        pref.enabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Preferences Settings */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/60">
              <PrefIcon className="w-5 h-5 text-primary" />
              <h2 className="text-headline-md font-bold text-on-surface">
                Preferences
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm text-on-surface-variant font-medium">
                  Language
                </label>
                <select className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                  <option>English (US)</option>
                  <option>Spanish (ES)</option>
                  <option>French (FR)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm text-on-surface-variant font-medium">
                  Timezone
                </label>
                <select className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                  <option>Pacific Time (PT)</option>
                  <option>Eastern Time (ET)</option>
                  <option>UTC Time</option>
                </select>
              </div>

              {/* Danger Zone */}
              <div className="mt-4 p-4 bg-error-container/20 border border-error-container rounded-lg flex flex-col gap-2">
                <h4 className="text-label-md font-bold text-error">Danger Zone</h4>
                <p className="text-[12px] text-on-surface-variant leading-tight">
                  Once you delete your account, all data is permanently lost.
                </p>
                <button className="w-fit mt-1 bg-surface border border-error/50 text-error px-3 py-1.5 rounded text-label-sm font-semibold hover:bg-error-container/30 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
