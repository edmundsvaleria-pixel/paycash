"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Mail, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function ContactPage() {
  const { t } = useLanguage();
  const [backHref, setBackHref] = useState("/");

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBackHref("/");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setBackHref(profile?.role === "admin" ? "/admin" : "/dashboard");
    }
    check();
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-start justify-center px-4 pt-12 sm:pt-20">
        <div className="w-full max-w-[560px]">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0070E0] hover:underline mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <h1 className="text-4xl font-black text-black tracking-tight text-center mb-3">
            Contact Us
          </h1>
          <p className="text-center text-base text-gray-600 mb-12">
            We're a small group, so we handle support personally.
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F0F2F9] flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-[#0070E0]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-black mb-1">
                    Group Admin
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    For payment records, balance questions, or account issues.
                  </p>
                  <p className="text-base font-medium text-black">
                    +1 (226) 241-1776
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F0F2F9] flex items-center justify-center">
                  <Mail className="h-6 w-6 text-[#0070E0]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-black mb-1">Email</h2>
                  <p className="text-sm text-gray-600 mb-3">
                    For anything you'd rather write down.
                  </p>
                  <p className="text-base font-medium text-black">
                    info@paycash.com
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F0F2F9] flex items-center justify-center">
                  <Clock className="h-6 w-6 text-[#0070E0]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-black mb-1">
                    Response Time
                  </h2>
                  <p className="text-sm text-gray-600">
                    We aim to respond within 24 hours. Payments recorded by the
                    admin appear on your dashboard immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href={backHref}
              className="block w-full rounded-full border-2 border-black bg-white text-center text-base font-bold text-black py-4 transition-colors hover:bg-gray-50"
            >
              Back
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