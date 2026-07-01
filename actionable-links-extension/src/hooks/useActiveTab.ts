import { useState, useEffect } from "react";
import { browser } from "../platform/browser";

export function useActiveTab() {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
  const [domain, setDomain] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTab() {
      try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs && tabs[0]) {
          const tab = tabs[0];
          setActiveTab(tab);
          if (tab.url) {
            const urlObj = new URL(tab.url);
            setDomain(urlObj.hostname);
          }
        }
      } catch (err) {
        console.error("Failed to query active tab details", err);
      } finally {
        setLoading(false);
      }
    }
    getTab();
  }, []);

  return { activeTab, domain, loading };
}
