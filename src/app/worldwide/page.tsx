"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const COUNTRIES = [
  { name: "Ghana", flag: "🇬🇭", note: "MoMo supported" },
  { name: "Nigeria", flag: "🇳🇬", note: "Bank transfer" },
  { name: "United Kingdom", flag: "🇬🇧", note: "Base currency (GBP)" },
  { name: "United States", flag: "🇺🇸", note: "Bank transfer" },
  { name: "Canada", flag: "🇨🇦", note: "Bank transfer" },
  { name: "Kenya", flag: "🇰🇪", note: "M-Pesa via MoMo option" },
  { name: "South Africa", flag: "🇿🇦", note: "Bank transfer" },
  { name: "Germany", flag: "🇩🇪", note: "EUR display" },
  { name: "France", flag: "🇫🇷", note: "EUR display" },
  { name: "India", flag: "🇮🇳", note: "Bank transfer" },
];

export default function WorldwidePage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-start justify-center px-4 pt-12 sm:pt-20">
        <div className="w-full max-w-[560px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0070E0] hover:underline mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <h1 className="text-4xl font-black text-black tracking-tight text-center mb-3">
            Worldwide
          </h1>
          <p className="text-center text-base text-gray-600 mb-12">
            Paypal is used by a small group across several countries.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COUNTRIES.map((c) => (
              <div
                key={c.name}
                className="border border-gray-200 rounded-2xl px-4 py-4 flex items-center gap-3"
              >
                <span className="text-2xl">{c.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-black text-sm truncate">
                    {c.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{c.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-gray-200 rounded-2xl p-6 bg-[#F0F2F9]">
            <h2 className="text-base font-bold text-[#002991] mb-2">
              Currency display
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              All contributions are recorded in GBP. The dashboard automatically
              shows the equivalent in your local currency based on your browser
              settings. If detection fails, it falls back to GBP.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="block w-full rounded-full border-2 border-black bg-white text-center text-base font-bold text-black py-4 transition-colors hover:bg-gray-50"
            >
              Back to Paypal
            </Link>
          </div>

          <LanguageSelector />
        </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-600">
          <Link href="/contact" className="hover:text-gray-900">{t("contact_us")}</Link>
          <Link href="/privacy" className="hover:text-gray-900">{t("privacy")}</Link>
          <Link href="/legal" className="hover:text-gray-900">{t("legal")}</Link>
          <Link href="/policy-updates" className="hover:text-gray-900">{t("policy_updates")}</Link>
          <Link href="/worldwide" className="hover:text-gray-900">{t("worldwide")}</Link>
        </div>
      </footer>
    </main>
  );
}