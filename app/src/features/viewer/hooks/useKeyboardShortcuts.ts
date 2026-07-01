import { useEffect } from "react";

interface KeybindActions {
  onNext: () => void;
  onPrev: () => void;
  onToggleComplete: () => void;
  onExit: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts({
  onNext,
  onPrev,
  onToggleComplete,
  onExit,
  disabled = false,
}: KeybindActions) {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering shortcuts when focusing inputs/textareas
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "Enter":
          e.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrev();
          break;
        case " ":
          e.preventDefault();
          onToggleComplete();
          break;
        case "Escape":
          e.preventDefault();
          onExit();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onPrev, onToggleComplete, onExit, disabled]);
}
