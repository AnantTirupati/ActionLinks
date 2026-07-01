"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";

export default function NoPermissionPage() {
  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "No Access" },
  ];

  return (
    <AppShell breadcrumbs={breadcrumbs} showSearch={false}>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        {/* Error Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 max-w-md w-full shadow-sm relative overflow-hidden flex flex-col items-center text-center">
          {/* Subtle Decorative Gradient */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          {/* Lock Icon */}
          <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full mb-6 border border-outline-variant relative">
            <Lock className="w-7 h-7 text-outline" />
            <div className="absolute -bottom-1 -right-1 bg-error-container text-error rounded-full p-1 border border-surface-container-lowest">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Subheading code */}
          <span className="text-label-sm text-outline font-bold uppercase tracking-wider mb-2">
            403 Forbidden
          </span>

          {/* Title */}
          <h1 className="text-headline-lg font-black text-on-surface mb-3">
            No Access
          </h1>

          {/* Description */}
          <p className="text-body-md text-on-surface-variant mb-8 max-w-sm">
            You do not have the necessary permissions to view this resource. Please
            contact your workspace administrator if you believe this is an error.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <Link
              href="/dashboard"
              className="w-full bg-primary-container text-on-primary font-semibold text-label-md py-2.5 rounded-lg hover:opacity-95 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Go to Dashboard
            </Link>
            <button className="w-full bg-surface border border-outline-variant text-on-surface font-semibold text-label-md py-2.5 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
              Request Access
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
