"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/layout/landing-navbar";
import { Footer } from "@/components/layout/footer";
import { CloudOff, RefreshCw, Activity, ChevronDown } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingNavbar />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center flex flex-col items-center gap-6">
          {/* Icon */}
          <div className="relative w-28 h-28 bg-error-container text-error rounded-full flex items-center justify-center animate-pulse border border-error/20">
            <CloudOff className="w-14 h-14" />
          </div>

          <div>
            <h1 className="text-display text-primary font-black leading-none tracking-tight mb-2">
              500
            </h1>
            <h2 className="text-headline-lg font-bold text-on-surface">
              Internal Server Error
            </h2>
            <p className="text-body-lg text-on-surface-variant mt-3 max-w-md mx-auto leading-relaxed">
              We're sorry, but something went wrong on our end. Our engineering
              team has been notified and is actively working to resolve the
              issue. Please try refreshing the page.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md hover:bg-primary-container transition-colors shadow-sm w-full sm:w-auto font-semibold"
            >
              <RefreshCw className="w-4.5 h-4.5" />
              Refresh Page
            </button>
            <Link
              href="/status"
              className="inline-flex items-center justify-center gap-2 bg-surface border border-outline-variant text-on-surface px-6 py-3 rounded-lg text-label-md hover:bg-surface-container-low transition-colors shadow-sm w-full sm:w-auto font-semibold"
            >
              <Activity className="w-4.5 h-4.5" />
              View System Status
            </Link>
          </div>

          {/* Technical Details (Disclosure collapsible details) */}
          <div className="w-full text-left mt-6">
            <details className="group bg-surface-container-low border border-outline-variant rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-label-sm text-on-surface-variant select-none flex justify-between items-center">
                Technical Details
                <ChevronDown className="w-4 h-4 text-outline-variant group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-3 p-3 bg-surface border border-outline-variant rounded font-mono text-[11px] text-outline overflow-x-auto whitespace-pre leading-normal">
                Error ID: ERR-500-A7B9C2
                <br />
                Timestamp: {new Date().toISOString()}
                <br />
                Service: api-gateway-prod-us-east-1
                <br />
                Request ID: req_9876543210
                <br />
                Message: {error?.message || "Upstream connection timeout"}
              </div>
            </details>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
