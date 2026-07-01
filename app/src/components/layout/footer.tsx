import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto border-t border-outline-variant bg-surface-container-lowest">
      <div className="mb-6 md:mb-0">
        <span className="text-headline-md font-bold text-on-surface">
          Action Links
        </span>
        <p className="text-body-md text-on-surface-variant mt-2">
          © 2024 Action Links Inc. All rights reserved.
        </p>
      </div>
      <div className="flex flex-wrap gap-6 justify-center">
        <Link
          href="#"
          className="text-body-md text-on-surface-variant hover:text-primary underline cursor-pointer"
        >
          Privacy Policy
        </Link>
        <Link
          href="#"
          className="text-body-md text-on-surface-variant hover:text-primary underline cursor-pointer"
        >
          Terms of Service
        </Link>
        <Link
          href="#"
          className="text-body-md text-on-surface-variant hover:text-primary underline cursor-pointer"
        >
          Security
        </Link>
        <Link
          href="#"
          className="text-body-md text-on-surface-variant hover:text-primary underline cursor-pointer"
        >
          Status
        </Link>
      </div>
    </footer>
  );
}
