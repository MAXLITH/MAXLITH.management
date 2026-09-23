"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulated - will be connected to backend in later phase
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-primary)]">
      {/* Background orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-[120px]" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-[var(--accent-purple)]/5 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        {/* Logo */}
        <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-purple)] flex items-center justify-center">
          <span className="text-white text-xl font-bold">M</span>
        </div>

        {isSent ? (
          <div className="animate-fade-in">
            <div className="w-12 h-12 mb-4 rounded-full bg-[var(--success-muted)] flex items-center justify-center">
              <CheckCircle size={24} className="text-[var(--success)]" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
              Check your email
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              We sent a password reset link to <strong className="text-[var(--text-primary)]">{email}</strong>.
              Check your inbox and follow the instructions.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
            >
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
              Reset your password
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mb-8">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@maxlith.com"
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-purple)] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            MAXLITH Management Platform • Internal Use Only
          </p>
        </div>
      </div>
    </div>
  );
}
