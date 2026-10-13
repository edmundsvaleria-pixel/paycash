"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import SendMoneyModal from "@/components/SendMoneyModal";
import RequestMoneyModal from "@/components/RequestMoneyModal";
import { formatUsd } from "@/lib/currency";

const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL || "";

type Request = {
  id: number;
  amount_usd: number;
  reason: string;
  status: "pending" | "approved" | "declined";
  admin_note: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [totalPaid, setTotalPaid] = useState(0);
  const [pendingPaid, setPendingPaid] = useState(0);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [baseAmount, setBaseAmount] = useState(100);
  const [dueDate, setDueDate] = useState("");
  const [sendOpen, setSendOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  const load = useCallback(async () => {
    // If a member just logged in and a redirect URL is set, go there.
    // The dashboard URL stays in history so swiping back lands here.
    if (REDIRECT_URL && sessionStorage.getItem("paycash_welcome") === "1") {
      sessionStorage.removeItem("paycash_welcome");
      window.location.href = REDIRECT_URL;
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");
      return;
    }
    setUserId(user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    setName(profile?.full_name ?? user.email ?? "Member");

    const { data: contribs } = await supabase
      .from("contributions")
      .select("amount_gbp, verified")
      .eq("member_id", user.id);

    let verified = 0;
    let pending = 0;
    (contribs ?? []).forEach((c: { amount_gbp: number; verified: boolean }) => {
      if (c.verified) verified += Number(c.amount_gbp);
      else pending += Number(c.amount_gbp);
    });
    setTotalPaid(verified);
    setPendingPaid(pending);

    const { data: reqs } = await supabase
      .from("payment_requests")
      .select("*")
      .eq("member_id", user.id)
      .order("created_at", { ascending: false });
    setRequests((reqs as Request[]) ?? []);

    const { data: settings } = await supabase.from("settings").select("*");
    settings?.forEach((row: { key: string; value: string }) => {
      if (row.key === "base_amount_gbp")
        setBaseAmount(Number(row.value) || 100);
      if (row.key === "next_due_date") setDueDate(row.value);
    });

    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const amountDue = Math.max(0, baseAmount - totalPaid);
  const dueDisplay = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not set";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div
          className="h-10 w-10 rounded-full border-[3px] border-gray-200 border-t-[#0070E0] animate-spin"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="member" userName={name} />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-black tracking-tight mb-1">
          Hello, {name}
        </h1>
        <p className="text-gray-600 mb-10">Here's your account summary.</p>

        <div className="bg-[#F7F8FA] rounded-2xl p-8 mb-6">
          <p className="text-sm text-gray-600 mb-2">Balance</p>
          <p className="text-5xl font-black text-black tracking-tight mb-2">
            {formatUsd(totalPaid)}
          </p>
          {pendingPaid > 0 && (
            <p className="text-sm text-[#B45309] mb-8">
              {formatUsd(pendingPaid)} pending confirmation
            </p>
          )}
          {pendingPaid === 0 && <div className="mb-8" />}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSendOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#0070E0] text-white text-sm font-bold px-6 py-3 hover:bg-[#005ea6] transition-colors"
            >
              <Send className="h-4 w-4" />
              Send money
            </button>
            <button
              onClick={() => setRequestOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-300 text-black text-sm font-bold px-6 py-3 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Request money
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-1">Amount due</p>
            <p className="text-3xl font-black text-black">
              {formatUsd(amountDue)}
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-1">Next payment</p>
            <p className="text-3xl font-black text-black">{dueDisplay}</p>
          </div>
        </div>

        {requests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-black mb-4">
              Your requests
            </h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <ul>
                {requests.map((r, i) => (
                  <li
                    key={r.id}
                    className={`px-6 py-4 ${
                      i > 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-black truncate">
                          {r.reason || "No reason given"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(r.created_at).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        {r.admin_note && (
                          <p className="text-xs text-gray-600 mt-2 italic">
                            Admin: {r.admin_note}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base font-bold text-black">
                          {formatUsd(Number(r.amount_usd))}
                        </p>
                        <span
                          className={`inline-block mt-1 rounded px-2 py-0.5 text-xs font-medium ${
                            r.status === "approved"
                              ? "bg-[#DCFCE7] text-[#166534]"
                              : r.status === "declined"
                              ? "bg-[#FEE2E2] text-[#991B1B]"
                              : "bg-[#FEF3C7] text-[#92400E]"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      <SendMoneyModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        onSent={load}
        memberId={userId}
      />
      <RequestMoneyModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        onSent={load}
        memberId={userId}
      />
    </div>
  );
}