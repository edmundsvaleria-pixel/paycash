"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";

type SettingsMap = {
  base_amount_gbp: string;
  next_due_date: string;
  momo_number: string;
  bank_details: string;
};

const DEFAULTS: SettingsMap = {
  base_amount_gbp: "100",
  next_due_date: new Date().toISOString().slice(0, 10),
  momo_number: "+1 (226) 241-1776",
  bank_details: "Paypal · 1234567890",
};

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsMap>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      const { data: me } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (me?.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      const { data } = await supabase.from("settings").select("*");
      const map: SettingsMap = { ...DEFAULTS };
      (data ?? []).forEach((row: { key: string; value: string }) => {
        if (row.key in map) {
          map[row.key as keyof SettingsMap] = row.value;
        }
      });
      setSettings(map);
      setLoading(false);
    }
    load();
  }, [router]);

  function update<K extends keyof SettingsMap>(key: K, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const supabase = createClient();

    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
    }));

    const { error: upsertError } = await supabase
      .from("settings")
      .upsert(rows, { onConflict: "key" });

    setSaving(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="admin" />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0070E0] hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <h1 className="text-4xl font-black text-black tracking-tight mb-1">
          Settings
        </h1>
        <p className="text-gray-600 mb-10">
          Configure amounts and payment details for your group.
        </p>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-6 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
            Settings saved.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Base amount per member (USD)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.base_amount_gbp}
              onChange={(e) => update("base_amount_gbp", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-black focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
            />
            <p className="text-xs text-gray-500 mt-2">
              Used to calculate each member's amount due.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Next payment date
            </label>
            <input
              type="date"
              value={settings.next_due_date}
              onChange={(e) => update("next_due_date", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-black focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              MoMo number
            </label>
            <input
              type="text"
              value={settings.momo_number}
              onChange={(e) => update("momo_number", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-black focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Bank details
            </label>
            <input
              type="text"
              value={settings.bank_details}
              onChange={(e) => update("bank_details", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-black focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-[#0070E0] text-white text-base font-bold py-4 transition-colors hover:bg-[#005ea6] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
        </form>
      </main>
    </div>
  );
}