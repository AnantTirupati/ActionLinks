"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Clock, Bookmark, ArrowRight } from "lucide-react";
import type { Tutorial } from "@/types";

interface TutorialCardProps {
  tutorial: Tutorial;
  variant?: "grid" | "compact";
}

const difficultyStyles: Record<string, string> = {
  Beginner: "bg-surface-container text-on-surface-variant",
  Intermediate: "bg-secondary-container text-on-secondary-container",
  Advanced: "bg-error-container text-on-error-container",
};

export function TutorialCard({ tutorial, variant = "grid" }: TutorialCardProps) {
  if (variant === "compact") {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col group hover:shadow-sm transition-shadow">
        <div className="h-32 bg-surface-container relative overflow-hidden">
          {tutorial.image && (
            <Image
              src={tutorial.image}
              alt={tutorial.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h4 className="text-label-md text-on-surface line-clamp-1">
            {tutorial.title}
          </h4>
          <p className="text-[13px] text-on-surface-variant line-clamp-2">
            {tutorial.description}
          </p>
          <div className="mt-auto pt-2 flex justify-between items-center">
            <span className="text-label-sm text-outline">
              {tutorial.updatedAt}
            </span>
            <Link
              href={`/tutorials/${tutorial.id}`}
              className="text-primary hover:bg-primary/5 p-1 rounded transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/tutorials/${tutorial.id}`}
      className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-md hover:border-outline transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full h-40 bg-surface-container-low overflow-hidden">
        {tutorial.image ? (
          <Image
            src={tutorial.image}
            alt={tutorial.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface px-2.5 py-1 rounded-md text-label-sm border border-outline-variant/50">
            {tutorial.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-inverse-surface/90 text-inverse-on-surface px-2 py-1 rounded text-label-sm flex items-center gap-1 backdrop-blur-sm">
          <Clock className="w-3.5 h-3.5" />
          {tutorial.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-label-sm",
              difficultyStyles[tutorial.difficulty]
            )}
          >
            {tutorial.difficulty}
          </span>
          <button
            onClick={(e) => e.preventDefault()}
            className="text-outline hover:text-primary transition-colors"
          >
            <Bookmark
              className={cn(
                "w-5 h-5",
                tutorial.bookmarked && "fill-primary text-primary"
              )}
            />
          </button>
        </div>
        <h3 className="text-[18px] leading-tight font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {tutorial.title}
        </h3>
        <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4 flex-1">
          {tutorial.description}
        </p>
        <div className="flex items-center mt-auto pt-4 border-t border-outline-variant">
          {tutorial.author.avatar ? (
            <Image
              src={tutorial.author.avatar}
              alt={tutorial.author.name}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full mr-2 object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full mr-2 bg-tertiary-container flex items-center justify-center text-on-tertiary text-[10px] font-medium">
              {tutorial.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
          <span className="text-label-sm text-on-surface-variant">
            {tutorial.author.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
