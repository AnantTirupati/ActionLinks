import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] h-full hero-pattern opacity-40 pointer-events-none -z-10" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="w-full max-w-[400px]">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg mb-3 shadow-sm"
          >
            AL
          </Link>
          <h1 className="text-headline-lg font-black text-on-surface">
            Action Links
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Convert screen recordings into interactive guides.
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
}
