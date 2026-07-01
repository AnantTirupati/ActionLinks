"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Wand2, Globe, Layout, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="w-full relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] h-[600px] hero-pattern opacity-60 pointer-events-none -z-10" />
      <div className="absolute top-48 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-6 pt-20 pb-16 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary text-label-sm border border-primary/20 mb-6 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by AI Extraction
        </div>

        <h1 className="font-display text-[40px] md:text-[56px] leading-[1.1] font-black text-on-surface tracking-tight max-w-4xl mb-6">
          Transform screen recordings <br className="hidden md:inline" />
          into <span className="text-primary">interactive guides</span>
        </h1>

        <p className="text-body-lg text-on-surface-variant max-w-2xl mb-8 md:text-[18px] leading-relaxed">
          Turn your recordings, videos, or website documentation into step-by-step
          interactive tutorials powered by AI. Seamlessly guide users through complex workflows.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary font-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-all shadow-sm group"
          >
            Start Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/tutorials"
            className="inline-flex items-center justify-center gap-2 bg-surface border border-outline-variant text-on-surface font-label-md px-6 py-3 rounded-lg hover:bg-surface-container-low transition-all"
          >
            Explore Library
          </Link>
        </div>

        {/* Browser Demo Container */}
        <div className="w-full max-w-5xl bg-surface-container-lowest border border-outline-variant rounded-xl p-3 shadow-xl relative group">
          {/* Windows Header Mock */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-outline-variant/60 mb-3 px-1">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="h-4 w-40 bg-surface border border-outline-variant rounded ml-4 text-[10px] text-outline flex items-center justify-center">
              actionlinks.com/demo
            </div>
          </div>
          <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-surface-container-low">
            <Image
              src="/images/image_7.png"
              alt="Interactive guide preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-[1280px] mx-auto px-6 py-20 border-t border-outline-variant">
        <div className="text-center mb-16">
          <h2 className="font-display text-[32px] font-bold text-on-surface mb-4">
            How Action Links Works
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Our AI-powered workspace does the heavy lifting, converting raw video into structured, easy-to-follow content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-4 hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-secondary-container text-primary flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-headline-md font-semibold text-on-surface">
              AI Video Processing
            </h3>
            <p className="text-body-md text-on-surface-variant">
              Extracts keyframes, cursor clicks, and typed text automatically to map out steps from your screen recordings.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-4 hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-secondary-container text-primary flex items-center justify-center">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="text-headline-md font-semibold text-on-surface">
              Customizable Workspace
            </h3>
            <p className="text-body-md text-on-surface-variant">
              Fine-tune and enrich generated tutorials with interactive prompts, code snippets, and custom steps in our clean editor.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-4 hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-secondary-container text-primary flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-headline-md font-semibold text-on-surface">
              Embed & Share Anywhere
            </h3>
            <p className="text-body-md text-on-surface-variant">
              Deploy guides as interactive overlays, embed on your documentation sites, or share directly using simple links.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-[1280px] mx-auto px-6 py-20 border-t border-outline-variant bg-surface-container-low/50">
        <div className="text-center mb-16">
          <h2 className="font-display text-[32px] font-bold text-on-surface mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Pick the plan that fits your workflow. Start building for free today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-headline-md font-bold text-on-surface">Free</h3>
              <p className="text-body-md text-on-surface-variant mb-4">For individuals trying it out.</p>
              <div className="text-[28px] font-black text-on-surface mb-6">$0</div>
              <ul className="space-y-2 mb-8">
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Up to 3 tutorials
                </li>
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Basic AI extraction
                </li>
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Public share links
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="w-full py-2 text-center text-label-md border border-outline hover:bg-surface-container-low transition-colors rounded-md text-on-surface"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-surface-container-lowest border-2 border-primary-container rounded-xl p-6 flex flex-col justify-between relative shadow-lg">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary-container text-on-primary text-[11px] font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div>
              <h3 className="text-headline-md font-bold text-on-surface">Pro</h3>
              <p className="text-body-md text-on-surface-variant mb-4">For active creators and teachers.</p>
              <div className="text-[28px] font-black text-on-surface mb-6">
                $29<span className="text-label-sm font-normal text-on-surface-variant">/mo</span>
              </div>
              <ul className="space-y-2 mb-8">
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Unlimited tutorials
                </li>
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Advanced AI extraction
                </li>
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Custom branding & embeds
                </li>
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Analytics dashboard
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="w-full py-2 text-center text-label-md bg-primary-container text-on-primary hover:opacity-90 transition-opacity rounded-md"
            >
              Try Pro
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-headline-md font-bold text-on-surface">Enterprise</h3>
              <p className="text-body-md text-on-surface-variant mb-4">For scaling teams and companies.</p>
              <div className="text-[28px] font-black text-on-surface mb-6">Custom</div>
              <ul className="space-y-2 mb-8">
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Unlimited everything
                </li>
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Dedicated support manager
                </li>
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Advanced team controls & SSO
                </li>
                <li className="text-body-md text-on-surface-variant flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> SLA & Security reviews
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="w-full py-2 text-center text-label-md border border-outline hover:bg-surface-container-low transition-colors rounded-md text-on-surface"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
