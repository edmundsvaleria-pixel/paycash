"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function PolicyUpdatesPage() {
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
            Policy Updates
          </h1>
          <p className="text-center text-base text-gray-600 mb-12">
            A record of every change we've made to Paypal's policies.
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-2xl p-6">
              <p className="text-xs font-bold text-[#0070E0] uppercase tracking-wide mb-2">
                12 October 2026
              </p>
              <h2 className="text-base font-bold text-black mb-2">
                Initial policies published
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Paypal launched with a Privacy Policy, Terms of Service, and
                Contact page. All members are subject to these from their first
                login.
              </p>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Coming soon
              </p>
              <h2 className="text-base font-bold text-black mb-2">
                Contribution verification rules
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                We're drafting a short policy on how the admin verifies
                payments and how disputes are resolved. It will appear here
                when ready.
              </p>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Coming soon
              </p>
              <h2 className="text-base font-bold text-black mb-2">
                Data export format
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                We plan to let members export their own contribution history as
                CSV. Details will be posted here.
              </p>
            </div>
          </div>

          <div className="mt-10">
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