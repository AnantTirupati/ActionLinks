import React, { useState, useEffect } from "react";

interface SpotlightProps {
  targetElement: HTMLElement | null;
  status: string;
}

export function Spotlight({ targetElement, status }: SpotlightProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!targetElement) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      setRect(targetElement.getBoundingClientRect());
    };

    updateRect();

    // Listen to scroll & resize
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect, true);

    // Dynamic layout polling
    const interval = setInterval(updateRect, 100);

    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect, true);
      clearInterval(interval);
    };
  }, [targetElement, status]);

  if (!rect) return null;

  const padding = 6;
  const x = rect.left - padding;
  const y = rect.top - padding;
  const w = rect.width + padding * 2;
  const h = rect.height + padding * 2;

  return (
    <svg
      className="fixed inset-0 pointer-events-none z-[999999]"
      style={{ width: "100vw", height: "100vh" }}
    >
      <defs>
        <mask id="spotlight-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx="8"
            ry="8"
            fill="black"
          />
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="rgba(0, 0, 0, 0.65)"
        mask="url(#spotlight-mask)"
        style={{ pointerEvents: "auto" }}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="8"
        ry="8"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2.5"
        className="animate-pulse"
      />
    </svg>
  );
}
