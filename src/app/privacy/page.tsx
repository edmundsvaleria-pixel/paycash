"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-center text-sm text-gray-500 mb-12">
            Last updated: 12 October 2026
          </p>

          <div className="space-y-6 text-gray-700 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-lg font-bold text-black mb-2">1. Who we are</h2>
              <p>
                Paypal is a private, invite-only contribution tracker used by a
                closed group of friends. It is not a public service and does not
                process real money. All payments happen outside this website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                2. What we collect
              </h2>
              <p>When you create an account, we collect:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Your full name</li>
                <li>Your email address</li>
                <li>Your phone number (optional)</li>
                <li>Your password</li>
              </ul>
              <p className="mt-3">
                When the admin records a payment, we store the amount, method,
                date, and any note.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                3. How we use it
              </h2>
              <p>
                Your information is used only to display your contribution
                history and balance to you and to the group admin. Nothing else.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                4. Who can see it
              </h2>
              <p>
                All members of this Paypal group can see the group's
                contribution records. The admin can see every member's name,
                email, phone number, and contribution history. Password data is
                visible only to the admin.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                5. Data retention
              </h2>
              <p>
                Your data stays in our database until you ask the admin to
                remove it. You can request deletion at any time using the
                contact details on our Contact page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                6. Security
              </h2>
              <p>
                We use Supabase for authentication and database storage.
                Passwords are handled by Supabase's secure auth system. We do
                not sell, trade, or share your data with any third party.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                7. Your rights
              </h2>
              <p>
                You can request a copy of your data, correct any inaccuracies,
                or ask us to delete your account entirely. Contact the admin
                through the Contact page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-black mb-2">
                8. Changes to this policy
              </h2>
              <p>
                If we change this policy, we'll update the "Last updated" date
                at the top. Continued use of Paypal means you accept the
                current version.
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