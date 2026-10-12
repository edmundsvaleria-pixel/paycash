"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo }
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-start justify-center px-4 pt-12 sm:pt-20">
        <div className="w-full max-w-[420px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0070E0] hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back_to_login")}
          </Link>

          <div className="bg-white rounded-xl border border-gray-200 px-8 py-12">
            <h1 className="text-center text-4xl font-extrabold text-black tracking-tight mb-3">
              Paypal
            </h1>
            <h2 className="text-center text-lg font-bold text-black mb-2">
              {t("reset_password_title")}
            </h2>
            <p className="text-center text-sm text-gray-600 mb-8">
              {t("reset_password_subtitle")}
            </p>

            {sent && (
              <div className="mb-6 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
                {t("reset_email_sent")}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                {error}
              </div>
            )}

            {!sent && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email")}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 text-base text-gray-900 placeholder-gray-400 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#0070E0] text-white text-base font-bold py-4 transition-colors hover:bg-[#005ea6] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? t("sending") : t("send_reset_link")}
                </button>
              </form>
            )}

            {sent && (
              <Link
                href="/"
                className="block w-full rounded-full border-2 border-gray-900 bg-white text-center text-base font-bold text-gray-900 py-4 transition-colors hover:bg-gray-50"
              >
                {t("back_to_login")}
              </Link>
            )}
          </div>

          <LanguageSelector />
        </div>
      </div>
    </main>
  );
}