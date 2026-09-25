"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Supabase auth callback error:", sessionError);
          setError(sessionError.message);
          return;
        }

        if (session) {
          router.replace("/dashboard");
        } else {
          const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (newSession || event === "SIGNED_IN") {
              authListener.subscription.unsubscribe();
              router.replace("/dashboard");
            }
          });

          const timer = setTimeout(() => {
            authListener.subscription.unsubscribe();
            router.replace("/dashboard");
          }, 2500);

          return () => clearTimeout(timer);
        }
      } catch (err: any) {
        console.error("Unexpected callback error:", err);
        setError("Failed to process login redirect.");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="text-center max-w-sm">
        {error ? (
          <div className="p-4 rounded-xl bg-[var(--danger-muted)] border border-[var(--danger)]/30 text-[var(--danger)] text-sm">
            <p className="font-semibold mb-1">Authentication Error</p>
            <p>{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-3 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-medium cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Connecting to MAXLITH via Supabase...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
