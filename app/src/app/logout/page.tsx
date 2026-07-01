"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function logout() {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    }
    logout();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-body-md text-on-surface-variant font-medium">
          Logging out...
        </p>
      </div>
    </div>
  );
}
