"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Search, Bell, HelpCircle, Menu, Plus } from "lucide-react";

interface TopNavbarProps {
  breadcrumbs?: { label: string; href?: string }[];
  showSearch?: boolean;
  showNavLinks?: boolean;
  activeNavLink?: string;
}

export function TopNavbar({
  breadcrumbs,
  showSearch = true,
  showNavLinks = false,
  activeNavLink,
}: TopNavbarProps) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email || "User";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 w-full h-16 bg-surface-container-lowest border-b border-outline-variant shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-on-surface-variant hover:text-primary transition-colors">
          <Menu className="w-6 h-6" />
        </button>

        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="hidden md:flex items-center gap-2 text-label-sm text-on-surface-variant">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-outline-variant">/</span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-on-surface font-medium">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Navigation Links */}
        {showNavLinks && (
          <nav className="hidden md:flex gap-6 h-full items-center">
            {["Dashboard", "Library", "Analytics"].map((link) => (
              <Link
                key={link}
                href={
                  link === "Dashboard"
                    ? "/dashboard"
                    : link === "Library"
                      ? "/tutorials"
                      : "#"
                }
                className={`text-body-md h-16 flex items-center transition-colors ${
                  activeNavLink === link
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-primary border-b-2 border-transparent hover:border-primary-container"
                }`}
              >
                {link}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        {showSearch && (
          <div className="relative hidden sm:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-[18px] h-[18px]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-1.5 bg-surface border border-outline-variant rounded-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/tutorials/create"
            className="hidden sm:flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-md text-label-md hover:bg-primary-container transition-colors"
          >
            <Plus className="w-[18px] h-[18px]" />
            Create Tutorial
          </Link>

          <div className="flex items-center gap-2 border-l border-outline-variant pl-4 ml-2">
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <Link href="/profile">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer ml-2 flex items-center justify-center bg-primary/10 text-primary font-bold text-xs select-none">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
