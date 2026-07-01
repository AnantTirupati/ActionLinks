"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  Clock,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Clock,
  Users,
};

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  colorClass?: string;
}

export function StatCard({ icon, label, value, colorClass = "text-primary" }: StatCardProps) {
  const Icon = iconMap[icon] || BookOpen;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full transition-transform group-hover:scale-150" />
      <Icon className={cn("w-6 h-6", colorClass)} />
      <span className="text-label-sm text-on-surface-variant">{label}</span>
      <span className="text-headline-lg text-on-surface">{value}</span>
    </div>
  );
}
