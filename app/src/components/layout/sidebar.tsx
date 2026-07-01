"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Video,
  Users,
  Terminal,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Home,
  Video,
  Users,
  Terminal,
  Settings,
  HelpCircle,
  LogOut,
};

interface SidebarNavItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  className?: string;
}

const mainNavItems: SidebarNavItem[] = [
  { label: "Home", href: "/dashboard", icon: "Home" },
  { label: "My Tutorials", href: "/tutorials", icon: "Video" },
  { label: "Team", href: "/team", icon: "Users" },
  { label: "API Keys", href: "/api-keys", icon: "Terminal" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

const footerNavItems: SidebarNavItem[] = [
  { label: "Support", href: "/support", icon: "HelpCircle" },
  { label: "Log Out", href: "/logout", icon: "LogOut" },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-surface-container-lowest border-r border-outline-variant w-64 h-full shrink-0 z-40",
        className
      )}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
            AL
          </div>
          <div className="flex flex-col">
            <span className="text-headline-md font-black text-primary leading-tight">
              Action Links
            </span>
            <span className="text-label-sm text-on-surface-variant">
              Free Plan
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col gap-1">
          {mainNavItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-label-md transition-all active:scale-95",
                  isActive
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-4">
          <button className="w-full py-2 px-4 border border-outline bg-surface-container-lowest text-on-surface rounded-md text-label-md hover:bg-surface-container-low transition-colors">
            Upgrade Now
          </button>
          <div className="h-px bg-outline-variant w-full" />
          <nav className="flex flex-col gap-1">
            {footerNavItems.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-label-md transition-all"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
