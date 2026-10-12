"use client";

import Link from "next/link";

type OnboardingHeaderProps = {
  leftSlot?: React.ReactNode;
  showLogin?: boolean;
};

export default function OnboardingHeader({
  leftSlot,
  showLogin = false,
}: OnboardingHeaderProps) {
  return (
    <div className="relative w-full flex items-center justify-between py-5 px-8">
      <div className="flex items-center w-32 relative">{leftSlot}</div>

      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 text-[26px] font-black text-black tracking-tight"
      >
        Paypal
      </Link>

      <div className="flex justify-end w-32">
        {showLogin && (
          <Link
            href="/"
            className="rounded-full border border-black px-5 py-2 text-sm font-bold text-black hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
        )}
      </div>
    </div>
  );
}