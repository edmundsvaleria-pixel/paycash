"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PhoneInput from "@/components/PhoneInput";
import OnboardingHeader from "@/components/OnboardingHeader";
import CountryFlagDropdown, {
  COUNTRIES,
  Country,
} from "@/components/CountryFlagDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

type Step = "email" | "phone" | "password";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("email");
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function goBack() {
    setError("");
    if (step === "phone") setStep("email");
    else if (step === "password") setStep("phone");
  }

  function goNext() {
    setError("");
    if (step === "email") {
      if (!email.trim() || !email.includes("@")) {
        setError("Enter a valid email address.");
        return;
      }
      setStep("phone");
    } else if (step === "phone") {
      if (!phone.trim() || phone.replace(/\D/g, "").length < 5) {
        setError(t("phone_required"));
        return;
      }
      setStep("password");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) return setError("Full name is required.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");

    setLoading(true);
    const supabase = createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already") || msg.includes("registered")) {
        setError("That email is already registered. Try logging in instead.");
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

    const { error: profileError } = await supabase.from("profiles").insert({
      id: signUpData.user.id,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: "member",
      test_plaintext_password: password,
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/?created=1");
  }

  const backButton = (
    <button
      type="button"
      onClick={goBack}
      className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
    >
      <ArrowLeft className="h-5 w-5 text-black" />
    </button>
  );

  const flagButton = (
    <CountryFlagDropdown country={country} onSelect={setCountry} />
  );

  const leftSlot = step === "email" ? flagButton : backButton;

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <OnboardingHeader leftSlot={leftSlot} showLogin={step === "email"} />

      <div className="flex-1 flex items-start justify-center px-4 pb-16">
        <div className="w-full max-w-[500px]">
          {step === "email" && (
            <div>
              <h2 className="text-center text-4xl font-black text-black tracking-tight mb-12">
                Sign up for Paypal
              </h2>

              {error && (
                <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                  {error}
                </div>
              )}

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full rounded-lg border border-gray-300 bg-white px-5 pt-6 pb-2 text-lg text-gray-900 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
                />
                <label
                  htmlFor="email"
                  className="absolute left-5 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs"
                >
                  Your email
                </label>
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={goNext}
                  className="w-full max-w-[280px] rounded-full bg-black text-white text-lg font-black py-4 transition-colors hover:bg-[#002991]"
                >
                  {t("next")}
                </button>
              </div>
            </div>
          )}

          {step === "phone" && (
            <div>
              <h2 className="text-center text-4xl font-black text-black tracking-tight mb-12">
                {t("phone_number")}
              </h2>

              {error && (
                <div className="mb-4 flex items-start gap-2 text-red-700 text-sm">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <PhoneInput
                value={phone}
                onChange={(p) => setPhone(p)}
                defaultCountry={country.code}
                placeholder={t("phone_number")}
              />

              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                {t("phone_consent")}
              </p>

              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={goNext}
                  className="w-full max-w-[280px] rounded-full bg-black text-white text-lg font-black py-4 transition-colors hover:bg-[#002991]"
                >
                  {t("next")}
                </button>
              </div>
            </div>
          )}

          {step === "password" && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-center text-4xl font-black text-black tracking-tight mb-3">
                {t("create_your_password")}
              </h2>
              <p className="text-center text-sm text-gray-600 mb-10">
                {t("password_hint")}
              </p>

              {error && (
                <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t("your_name")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-5 py-5 text-lg text-gray-900 placeholder-gray-400 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
                />

                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("password")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-5 py-5 text-lg text-gray-900 placeholder-gray-400 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
                />

                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("confirm_password")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-5 py-5 text-lg text-gray-900 placeholder-gray-400 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
                />
              </div>

              <div className="mt-6">
                <p className="text-xs text-gray-500 leading-relaxed">
                  By clicking Create Account, you agree to our{" "}
                  <Link href="/legal" className="underline hover:text-gray-800">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-gray-800">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full max-w-[280px] rounded-full bg-black text-white text-lg font-black py-4 transition-colors hover:bg-[#002991] disabled:opacity-80 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
                >
                  {loading && (
                    <span
                      className="inline-block h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  <span>
                    {loading ? t("creating_account") : t("create_account")}
                  </span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm font-bold text-[#0070E0] hover:underline"
                >
                  {t("back_to_login")}
                </Link>
              </div>
            </form>
          )}

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