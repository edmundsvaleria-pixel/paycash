"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type NavbarProps = {
  variant?: "guest" | "member" | "admin";
  userName?: string;
};

export default function Navbar({ variant = "guest", userName }: NavbarProps) {
  const router = useRouter();
  const isLoggedIn = variant !== "guest";
  const isAdmin = variant === "admin";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href={isLoggedIn ? (isAdmin ? "/admin" : "/dashboard") : "/"}
          className="text-[22px] font-black text-black tracking-tight"
        >
          Paypal
        </Link>

        <div className="flex items-center gap-6">
          {isLoggedIn && (
            <>
              <Link
                href={isAdmin ? "/admin" : "/dashboard"}
                className="text-sm font-bold text-black hover:text-[#0070E0] transition-colors"
              >
                Home
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/settings"
                  className="hidden sm:inline text-sm font-bold text-black hover:text-[#0070E0] transition-colors"
                >
                  Account
                </Link>
              )}
            </>
          )}

          {isLoggedIn && userName && (
            <span className="hidden md:inline text-sm text-gray-500 font-medium">
              {userName}
            </span>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm font-bold text-black hover:text-[#0070E0] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}