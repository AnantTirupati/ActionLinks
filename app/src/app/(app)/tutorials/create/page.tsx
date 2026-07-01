"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/ui/stepper";
import { ArrowLeft, Play, Upload, Globe, Check } from "lucide-react";
import type { SourceType } from "@/types";
import { createTutorial } from "@/features/tutorials/actions";

const sourceOptions: { type: SourceType; icon: string; title: string; description: string; placeholder?: string }[] = [
  {
    type: "youtube",
    icon: "PlaySquare",
    title: "Paste YouTube URL",
    description: "Extract steps directly from a public video.",
    placeholder: "https://youtube.com/watch?v=...",
  },
  {
    type: "upload",
    icon: "Upload",
    title: "Upload Recording",
    description: "Drag and drop MP4 or WebM files.",
  },
  {
    type: "website",
    icon: "Globe",
    title: "Paste Website URL",
    description: "Parse documentation or web guides.",
    placeholder: "https://docs.example.com...",
  },
];

const iconMap = {
  youtube: Play,
  upload: Upload,
  website: Globe,
};

export default function CreateTutorialPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<SourceType | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const steps = [
    { label: "Source" },
    { label: "Processing" },
    { label: "Preview" },
    { label: "Finalize" },
  ];

  const handleSelectType = (type: SourceType) => {
    setSelectedType(type);
    setInputValue(""); // Reset on select
  };

  const isFormValid = () => {
    if (!selectedType) return false;
    if (selectedType === "upload") return true; // File dropped simulation
    return inputValue.length > 5;
  };

  const handleCreate = async () => {
    if (!isFormValid()) return;
    setLoading(true);
    try {
      const tutorial = await createTutorial({
        title: `AI Extracted Guide (${selectedType})`,
        description: "Extracting steps from source using AI...",
        source_type: selectedType!,
        source_url: selectedType === "upload" ? "uploaded_recording.mp4" : inputValue,
        status: "processing",
      });
      router.push(`/tutorials/create/processing?id=${tutorial.id}`);
    } catch (err) {
      console.error("Failed to create tutorial:", err);
      alert("Failed to initiate tutorial creation. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-on-background flex flex-col font-sans antialiased">
      {/* Transactional Minimal Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 max-w-3xl mx-auto shrink-0">
        <Link
          href="/tutorials"
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-label-md">Cancel</span>
        </Link>
        <div className="text-label-md text-on-surface-variant">Step 1 of 4</div>
        <div className="w-20" /> {/* Spacer */}
      </header>

      {/* Main Focused Canvas */}
      <main className="flex-1 flex flex-col items-center px-6 pb-12 max-w-3xl mx-auto w-full">
        {/* Stepper */}
        <div className="w-full mb-10">
          <Stepper steps={steps} currentStep={1} />
        </div>

        {/* Heading */}
        <div className="w-full text-center mb-8">
          <h1 className="text-display text-on-surface mb-2 font-black tracking-tight">
            Create a New Tutorial
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Select your source material to begin the AI-powered extraction.
          </p>
        </div>

        {/* Source Cards Selection Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {sourceOptions.map((opt) => {
            const Icon = iconMap[opt.type];
            const isSelected = selectedType === opt.type;

            return (
              <button
                key={opt.type}
                onClick={() => handleSelectType(opt.type)}
                className={`text-left bg-surface-container-lowest border rounded-xl p-5 hover:border-outline transition-all flex flex-col gap-4 relative focus:outline-none focus:ring-2 focus:ring-primary-container ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-secondary-container/10"
                    : "border-outline-variant"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-label-md font-semibold text-on-surface mb-1">
                    {opt.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant leading-snug">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded Inline Input Form depending on selection */}
        {selectedType && (
          <div className="w-full bg-surface-container-lowest border border-outline-variant p-6 rounded-xl mb-12 shadow-sm animate-pulse-subtle">
            {selectedType === "youtube" && (
              <div className="flex flex-col gap-2">
                <label className="text-label-sm text-on-surface-variant font-medium">
                  YouTube Video Link
                </label>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            )}

            {selectedType === "upload" && (
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low transition-colors">
                <Upload className="w-8 h-8 text-outline-variant mb-2 animate-bounce" />
                <span className="text-label-md font-semibold text-on-surface">
                  Drag & Drop files here
                </span>
                <span className="text-body-md text-on-surface-variant mt-1">
                  Supports MP4, WebM or MOV (Max 200MB)
                </span>
              </div>
            )}

            {selectedType === "website" && (
              <div className="flex flex-col gap-2">
                <label className="text-label-sm text-on-surface-variant font-medium">
                  Documentation Site URL
                </label>
                <input
                  type="text"
                  placeholder="https://docs.example.com/guide"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="w-full flex justify-end pt-6 border-t border-outline-variant mt-auto">
          <button
            onClick={handleCreate}
            disabled={!isFormValid() || loading}
            className={`px-6 py-3 rounded-lg text-label-md font-semibold transition-all ${
              isFormValid() && !loading
                ? "bg-primary text-on-primary hover:bg-primary-container shadow-sm active:scale-95 cursor-pointer"
                : "bg-outline-variant text-on-surface-variant opacity-50 cursor-not-allowed pointer-events-none"
            }`}
          >
            {loading ? "Initializing..." : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}
