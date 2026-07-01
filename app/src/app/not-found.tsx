"use client";

import Link from "next/link";
import { LandingNavbar } from "@/components/layout/landing-navbar";
import { Footer } from "@/components/layout/footer";
import { AlertTriangle, Home, LifeBuoy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingNavbar />
      
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-error-container text-error rounded-full flex items-center justify-center border border-error/20 relative group">
            <AlertTriangle className="w-12 h-12 animate-pulse" />
          </div>

          <div>
            <h1 className="text-display text-primary font-black leading-none tracking-tight mb-2">
              404
            </h1>
            <h2 className="text-headline-lg font-bold text-on-surface">
              Page Not Found
            </h2>
            <p className="text-body-lg text-on-surface-variant mt-3 leading-relaxed">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md hover:bg-primary-container transition-colors shadow-sm w-full sm:w-auto"
            >
              <Home className="w-4.5 h-4.5" />
              Back to Dashboard
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center justify-center gap-2 bg-surface border border-outline-variant text-on-surface px-6 py-3 rounded-lg text-label-md hover:bg-surface-container-low transition-colors shadow-sm w-full sm:w-auto"
            >
              <LifeBuoy className="w-4.5 h-4.5" />
              Contact Support
            </Link>
          </div>

          <div className="w-full mt-10 pt-6 border-t border-outline-variant/60 border-dashed">
            <p className="text-label-sm text-outline uppercase tracking-wider mb-3">
              Quick Links
            </p>
            <div className="flex justify-center gap-6 text-body-md text-on-surface-variant">
              <Link href="/docs" className="hover:text-primary transition-colors">
                Documentation
              </Link>
              <span className="text-outline-variant">•</span>
              <Link href="/status" className="hover:text-primary transition-colors">
                System Status
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
