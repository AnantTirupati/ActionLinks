import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Overlay } from "../overlay/Overlay";
import { playerController } from "../engine/Controller";
import { domObserver } from "../observer/domObserver";
import { messageReceiver } from "../messaging/receiver";
import { messageSender } from "../messaging/sender";
import { MESSAGES } from "../constants";

let rootContainer: HTMLElement | null = null;
let shadowRoot: ShadowRoot | null = null;

function injectOverlay() {
  if (rootContainer) return;

  rootContainer = document.createElement("div");
  rootContainer.id = "actionlinks-extension-root";
  rootContainer.style.position = "fixed";
  rootContainer.style.zIndex = "2147483647";
  document.body.appendChild(rootContainer);

  shadowRoot = rootContainer.attachShadow({ mode: "open" });

  // Injected CSS reference
  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.href = chrome.runtime.getURL("assets/overlay.css");
  shadowRoot.appendChild(styleLink);

  const reactMount = document.createElement("div");
  reactMount.id = "actionlinks-react-mount";
  shadowRoot.appendChild(reactMount);

  const root = createRoot(reactMount);
  root.render(React.createElement(OverlayMountWrapper));

  domObserver.start();
}

function OverlayMountWrapper() {
  const [availableCount, setAvailableCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [tutorials, setTutorials] = useState<any[]>([]);

  useEffect(() => {
    async function checkTutorials() {
      const hostname = window.location.hostname;
      try {
        const response = await messageSender.sendToBackground(MESSAGES.GET_ACTIVE_TAB, {
          domain: hostname
        } as any);
        if (response && Array.isArray(response)) {
          setTutorials(response);
          setAvailableCount(response.length);
          if (response.length > 0) {
            setShowBanner(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    checkTutorials();
  }, []);

  const handleStart = () => {
    if (tutorials.length > 0) {
      setShowBanner(false);
      playerController.start(tutorials[0]);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  return React.createElement(
    React.Fragment,
    null,
    showBanner && React.createElement(
      "div",
      { className: "fixed top-6 right-6 p-4 bg-zinc-900 border border-zinc-800 text-white rounded-xl shadow-2xl z-[999999] flex flex-col gap-3 font-sans w-72 border-t-4 border-t-blue-500" },
      React.createElement(
        "div",
        { className: "flex items-start gap-2.5" },
        React.createElement("span", { className: "text-lg" }, "💡"),
        React.createElement(
          "div",
          null,
          React.createElement("p", { className: "text-xs font-bold" }, `${availableCount} guides available`),
          React.createElement("p", { className: "text-[11px] text-zinc-400 mt-0.5" }, `Interactive training guides for ${window.location.hostname}.`)
        )
      ),
      React.createElement(
        "div",
        { className: "flex gap-2 justify-end text-xs font-semibold" },
        React.createElement(
          "button",
          { onClick: handleDismiss, className: "px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer" },
          "Dismiss"
        ),
        React.createElement(
          "button",
          { onClick: handleStart, className: "px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer" },
          "Start"
        )
      )
    ),
    React.createElement(Overlay, null)
  );
}

// Receive messages from background script
messageReceiver.addListener((message, sender, sendResponse) => {
  if (message.type === MESSAGES.SHOW_OVERLAY) {
    injectOverlay();
    sendResponse({ success: true });
  } else if (message.type === MESSAGES.START_TUTORIAL) {
    injectOverlay();
    const { tutorialId } = message.payload as any;
    messageSender.sendToBackground(MESSAGES.START_TUTORIAL, { tutorialId }).then((res) => {
      if (res && (res as any).tutorial) {
        playerController.start((res as any).tutorial, (res as any).currentStep, (res as any).completedSteps);
      }
    });
    sendResponse({ success: true });
  } else if (message.type === MESSAGES.STOP_TUTORIAL) {
    playerController.stop();
    domObserver.stop();
    sendResponse({ success: true });
  }
});

// Auto initialize on content load
injectOverlay();
