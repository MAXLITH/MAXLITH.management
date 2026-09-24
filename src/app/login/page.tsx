"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "CredentialsSignin") {
      setError("Invalid email or password");
    } else if (urlError === "Configuration") {
      setError("Configuration error. Please try logging in again.");
    } else if (urlError) {
      setError(urlError);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error
        );
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setIsLoading(false);
  };

  const handleOAuthSignIn = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl });
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
          Welcome back
        </h2>
        <p className="text-[var(--text-secondary)] text-sm">
          Sign in to your MAXLITH workspace
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-[var(--danger-muted)] border border-[var(--danger)]/30 text-[var(--danger)] text-sm animate-fade-in">
          {error}
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.04 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuthSignIn("github")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-[var(--border)] w-full" />
        <span className="bg-[var(--bg-primary)] px-3 text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono shrink-0">
          Or continue with
        </span>
        <div className="border-t border-[var(--border)] w-full" />
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
