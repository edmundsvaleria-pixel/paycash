"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function LegalPage() {
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
            Terms of Service
          </h1>
          <p className="text-center text-sm text-gray-500 mb-12">
            Last updated: 12 October 2026
          </p>

          <div className="space-y-6 text-gray-700 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                1. What Paypal is
              </h2>
              <p>
                Paypal is a private contribution tracker for a closed group of
                friends. It does not process payments, hold funds, or transfer
                money. It is a record-keeping tool only.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                2. Eligibility
              </h2>
              <p>
                You must be invited by an existing member of the group to use
                Paypal. Accounts are for personal use only.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                3. Your account
              </h2>
              <p>
                You are responsible for keeping your password safe. Do not
                share your login with anyone. If you suspect your account has
                been accessed by someone else, contact the admin immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                4. Contributions
              </h2>
              <p>
                Contribution amounts, due dates, and methods are set by the
                group admin. Paypal records what the admin enters. If you
                believe a record is wrong, contact the admin — do not attempt
                to modify records yourself.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                5. Acceptable use
              </h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Use Paypal for anything illegal</li>
                <li>Attempt to access another member's account</li>
                <li>Upload malicious code or attempt to break the site</li>
                <li>Share your account credentials with non-members</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                6. No financial advice
              </h2>
              <p>
                Paypal is not a bank, payment processor, or financial advisor.
                Nothing on this site should be treated as financial advice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                7. Availability
              </h2>
              <p>
                We aim to keep Paypal running, but we make no guarantee of
                uptime. The service is provided "as is" and may change or be
                discontinued at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                8. Limitation of liability
              </h2>
              <p>
                Paypal and its admin are not liable for any losses arising from
                use of this site. Since no money moves through Paypal, the
                financial risk is limited to record-keeping errors, which we
                will correct on request.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                9. Termination
              </h2>
              <p>
                The admin may remove any account at any time, for any reason,
                including inactivity or breach of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                10. Changes
              </h2>
              <p>
                We may update these terms. Continued use after a change means
                you accept the new version.
              </p>
            </section>
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