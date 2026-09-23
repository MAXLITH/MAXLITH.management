"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2, Shield, Bell, Key, Globe } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
          <Settings className="text-[var(--accent)]" size={26} />
          <span>Platform & Workspace Settings</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Configure organization preferences, GitHub tokens, notification webhooks, and security policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-6 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
            Company Identity & Workspace
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Company Name</label>
              <input type="text" defaultValue="MAXLITH AI Trading Technologies" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Workspace Slug</label>
              <input type="text" defaultValue="management.maxlith" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] font-mono" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
            GitHub & Developer Integrations
          </h2>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">GitHub Organization Name</label>
            <input type="text" defaultValue="maxlith" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] font-mono" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">GitHub Webhook Secret</label>
            <input type="password" defaultValue="ghp_maxlith_secret_token_2026" className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] font-mono" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          {saved ? (
            <div className="flex items-center gap-2 text-xs text-[var(--success)] font-semibold">
              <CheckCircle2 size={16} />
              <span>Workspace settings updated!</span>
            </div>
          ) : <div />}
          <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20">
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
