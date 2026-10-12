"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setReady(true);
    }
    check();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(t("password_updated"));
    setTimeout(async () => {
      await supabase.auth.signOut();
      router.push("/");
    }, 1500);
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#686A6D]">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-start justify-center px-4 pt-12 sm:pt-20">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-xl border border-gray-200 px-8 py-12">
            <h1 className="text-center text-4xl font-extrabold text-black tracking-tight mb-3">
              Paypal
            </h1>
            <h2 className="text-center text-lg font-bold text-black mb-2">
              {t("set_new_password")}
            </h2>
            <p className="text-center text-sm text-gray-600 mb-8">
              {t("set_new_password_subtitle")}
            </p>

            {success && (
              <div className="mb-6 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("new_password")}
                required
                minLength={6}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 text-base text-gray-900 placeholder-gray-400 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
              />

              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t("confirm_password")}
                required
                minLength={6}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 text-base text-gray-900 placeholder-gray-400 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#0070E0] text-white text-base font-bold py-4 transition-colors hover:bg-[#005ea6] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t("updating") : t("update_password")}
              </button>
            </form>
          </div>

          <LanguageSelector />
        </div>
      </div>
    </main>
  );
}