"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [githubOrg, setGithubOrg] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setCompanyName(data.companyName || "MAXLITH");
          setWorkspaceSlug(data.workspaceSlug || "maxlith-management");
          setGithubOrg(data.githubOrg || "");
          setWebhookSecret(data.webhookSecret || "");
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          workspaceSlug,
          githubOrg,
          webhookSecret,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save settings");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
          <Settings className="text-[var(--accent)]" size={26} />
          <span>Platform & Workspace Settings</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Configure organization preferences, GitHub integration, and notification webhooks.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-6 shadow-sm">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
            Company Identity & Workspace
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Company Name
              </label>
              <input
                type="text"
                disabled={loading}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="MAXLITH"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Workspace Slug
              </label>
              <input
                type="text"
                disabled={loading}
                value={workspaceSlug}
                onChange={(e) => setWorkspaceSlug(e.target.value)}
                placeholder="maxlith-management"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
            GitHub & Developer Integrations
          </h2>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              GitHub Organization Name
            </label>
            <input
              type="text"
              disabled={loading}
              value={githubOrg}
              onChange={(e) => setGithubOrg(e.target.value)}
              placeholder="e.g. MAXLITH"
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              GitHub Webhook Secret
            </label>
            <input
              type="password"
              disabled={loading}
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              placeholder="Enter webhook secret..."
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          {saved ? (
            <div className="flex items-center gap-2 text-xs text-[var(--success)] font-semibold">
              <CheckCircle2 size={16} />
              <span>Workspace settings updated!</span>
            </div>
          ) : <div />}
          <button
            type="submit"
            disabled={saving || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold transition-all shadow-md shadow-[var(--accent)]/20 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
