"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/supabaseClient";

function SignUpForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Mobile logo */}
      <div className="lg:hidden text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center">
          <span className="text-white text-xl font-bold">M</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">MAXLITH</h1>
        <p className="text-sm text-[var(--text-muted)]">Management Platform</p>
      </div>

      {/* Form header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
          Create an account
        </h2>
        <p className="text-[var(--text-secondary)] text-sm">
          Get started with your MAXLITH workspace
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@maxlith.com"
            required
            autoComplete="email"
            className="w-full h-11 px-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all text-sm"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--text-secondary)]"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              autoComplete="new-password"
              className="w-full h-11 px-4 pr-11 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-purple)] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-[var(--accent)]/20 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Sign up with Email
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Error message under the form */}
      {error && (
        <p className="mt-4 p-3 rounded-lg bg-[var(--danger-muted)] border border-[var(--danger)]/30 text-[var(--danger)] text-sm text-center">
          {error}
        </p>
      )}

      {/* Navigation to Sign In */}
      <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
          Sign in
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
        <p className="text-xs text-[var(--text-muted)]">
          MAXLITH Management Platform • Internal Use Only
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--bg-secondary)] items-center justify-center">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[var(--accent)]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-10 w-60 h-60 bg-[var(--accent-purple)]/10 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">M</span>
          </div>

          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
            MAXLITH
          </h1>
          <p className="text-lg text-[var(--accent-hover)] font-medium mb-2">
            AI Trading Intelligence
          </p>
          <div className="w-12 h-0.5 mx-auto bg-gradient-to-r from-[var(--accent)] to-[var(--accent-purple)] rounded-full mb-6" />
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Internal Management Platform. Access your workspace, projects, tasks,
            documentation, and team — all in one place.
          </p>
        </div>
      </div>

      {/* Right Panel - Sign Up Form inside Suspense */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[var(--bg-primary)]">
        <Suspense fallback={<div className="text-xs text-[var(--text-muted)]">Loading signup portal...</div>}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
