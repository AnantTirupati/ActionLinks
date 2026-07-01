import Link from "next/link";

export function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 w-full h-16 bg-surface border-b border-outline-variant">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-headline-md font-bold text-primary"
        >
          Action Links
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="#features"
            className="text-on-surface-variant hover:text-primary transition-colors text-label-md cursor-pointer active:opacity-80"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-on-surface-variant hover:text-primary transition-colors text-label-md cursor-pointer active:opacity-80"
          >
            Pricing
          </Link>
          <Link
            href="/tutorials"
            className="text-on-surface-variant hover:text-primary transition-colors text-label-md cursor-pointer active:opacity-80"
          >
            Library
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="hidden md:block text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="bg-primary-container text-on-primary text-label-md px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
