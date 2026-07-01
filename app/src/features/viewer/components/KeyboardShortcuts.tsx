import React from "react";
import { X } from "lucide-react";

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-xl w-full max-w-md relative flex flex-col gap-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-headline-md font-black text-on-surface">
            Keyboard Shortcuts
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Navigate and play tutorials using simple hotkeys.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { key: "→ / Enter", action: "Go to Next Step" },
            { key: "←", action: "Go to Previous Step" },
            { key: "Spacebar", action: "Toggle Mark Step Complete" },
            { key: "Escape", action: "Exit Player Session" },
          ].map((shortcut, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2.5 border-b border-outline-variant/60 last:border-0"
            >
              <span className="text-body-md text-on-surface-variant">
                {shortcut.action}
              </span>
              <kbd className="bg-surface border border-outline-variant rounded px-2 py-1 text-label-sm font-mono text-primary font-bold shadow-sm">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-primary text-on-primary rounded-md text-label-md font-semibold hover:bg-primary-container transition-colors mt-2 cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
