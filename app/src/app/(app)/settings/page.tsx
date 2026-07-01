"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import {
  Settings,
  Palette,
  Shield,
  Languages,
  CreditCard,
  Share2,
  Upload,
} from "lucide-react";

export default function WorkspaceSettingsPage() {
  const [name, setName] = useState("Acme Corp");
  const [slug, setSlug] = useState("acme");

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Workspace Settings" },
  ];

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-display text-on-surface font-black">
          Workspace Settings
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Manage your organization settings, custom domain, and billing.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sub-Navigation Pane */}
        <nav className="w-full md:w-64 bg-surface-container-low border border-outline-variant rounded-xl p-3 flex flex-col gap-1 shrink-0">
          <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider px-3 py-1.5 block">
            Workspace Configuration
          </span>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-label-md font-bold transition-all active:scale-95"
          >
            <Settings className="w-5 h-5 text-primary" />
            General
          </Link>
          {[
            { label: "Appearance", icon: Palette },
            { label: "Privacy & Security", icon: Shield },
            { label: "Language", icon: Languages },
            { label: "Billing Plans", icon: CreditCard },
            { label: "Connected Accounts", icon: Share2 },
          ].map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-label-md transition-all text-left"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Form Card */}
        <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6 w-full">
          <h2 className="text-headline-lg font-bold text-on-surface pb-3 border-b border-outline-variant/60">
            General Settings
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo Upload */}
            <div className="flex flex-col gap-2 shrink-0">
              <label className="text-label-sm text-on-surface-variant font-medium">
                Workspace Logo
              </label>
              <div className="w-24 h-24 bg-surface-container rounded-lg border border-dashed border-outline flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors text-center p-2">
                <Upload className="w-6 h-6 text-outline mb-1" />
                <span className="text-[10px] text-outline">Upload Logo</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="flex-grow flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm text-on-surface-variant font-medium">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm text-on-surface-variant font-medium">
                  Workspace URL
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-outline-variant bg-surface text-on-surface-variant text-body-md rounded-l-md select-none">
                    actionlinks.com/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-grow bg-surface border border-outline-variant rounded-r-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-outline-variant/60">
            <button className="bg-primary text-on-primary text-label-md px-6 py-2 rounded-md font-semibold hover:bg-primary-container transition-colors shadow-sm">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
