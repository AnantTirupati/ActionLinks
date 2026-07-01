import { useState, useEffect } from "react";
import { storage } from "../lib/storage";

export function useStorage(key: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const session = await storage.loadSession();
        setData(session);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [key]);

  return { data, loading };
}
