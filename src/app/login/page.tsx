"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/supabaseClient";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError("");
    setIsOAuthLoading("google");
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in with Google.");
    } finally {
      setIsOAuthLoading(null);
    }
  };

  const handleGithubSignIn = async () => {
    setError("");
    setIsOAuthLoading("github");
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in with GitHub.");
    } finally {
      setIsOAuthLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else if (data?.user) {
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
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
          Welcome back
        </h2>
        <p className="text-[var(--text-secondary)] text-sm">
          Sign in to your MAXLITH workspace
        </p>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isOAuthLoading !== null}
          className="h-11 px-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] font-medium text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
        >
          {isOAuthLoading === "google" ? (
            <Loader2 size={18} className="animate-spin text-[var(--text-muted)]" />
          ) : (
            <GoogleIcon className="w-4 h-4" />
          )}
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={handleGithubSignIn}
          disabled={isLoading || isOAuthLoading !== null}
          className="h-11 px-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] font-medium text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
        >
          {isOAuthLoading === "github" ? (
            <Loader2 size={18} className="animate-spin text-[var(--text-muted)]" />
          ) : (
            <GithubIcon className="w-4 h-4" />
          )}
          <span>GitHub</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--bg-primary)] px-3 text-[var(--text-muted)] tracking-wider">
            or continue with email
          </span>
        </div>
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
              placeholder="Enter your password"
              required
              autoComplete="current-password"
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
              Sign in with Email
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

      {/* Navigation to Sign Up */}
      <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">
          Sign up
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

export default function LoginPage() {
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

      {/* Right Panel - Login Form inside Suspense */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[var(--bg-primary)]">
        <Suspense fallback={<div className="text-xs text-[var(--text-muted)]">Loading login portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
