"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Settings as SettingsIcon,
  Check,
  X as XIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import MembersTable from "@/components/MembersTable";
import RecordPaymentModal from "@/components/RecordPaymentModal";
import { formatUsd } from "@/lib/currency";
import type { Contribution, Profile } from "@/types/database";

type PendingContribution = {
  id: number;
  member_id: string;
  amount_gbp: number;
  method: string;
  note: string;
  contributed_at: string;
  verified: boolean;
};

type RequestRow = {
  id: number;
  member_id: string;
  amount_usd: number;
  reason: string;
  status: "pending" | "approved" | "declined";
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [name, setName] = useState("Admin");
  const [members, setMembers] = useState<Profile[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");
      return;
    }

    const { data: me } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    if (me?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    setName(me.full_name ?? "Admin");

    const { data: profs } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });

    const { data: contribs } = await supabase
      .from("contributions")
      .select("*")
      .order("contributed_at", { ascending: false });

    const { data: reqs } = await supabase
      .from("payment_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setMembers((profs as Profile[]) ?? []);
    setContributions((contribs as Contribution[]) ?? []);
    setRequests((reqs as RequestRow[]) ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function verifyContribution(id: number) {
    const supabase = createClient();
    await supabase
      .from("contributions")
      .update({ verified: true, verified_at: new Date().toISOString() })
      .eq("id", id);
    load();
  }

  async function rejectContribution(id: number) {
    const supabase = createClient();
    await supabase.from("contributions").delete().eq("id", id);
    load();
  }

  async function resolveRequest(id: number, status: "approved" | "declined") {
    const supabase = createClient();
    await supabase
      .from("payment_requests")
      .update({ status, resolved_at: new Date().toISOString() })
      .eq("id", id);
    load();
  }

  function exportCsv() {
    const rows = [
      ["Full Name", "Email", "Phone", "Role", "Balance (USD)"],
      ...members.map((m) => [
        m.full_name,
        m.email,
        m.phone ?? "",
        m.role,
        String(balanceFor(m.id)),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paycash-members-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function balanceFor(memberId: string): number {
    const paid = contributions
      .filter((c) => c.member_id === memberId && c.verified)
      .reduce((sum, c) => sum + Number(c.amount_gbp), 0);
    return Math.max(0, 100 - paid);
  }

  function memberName(id: string): string {
    return members.find((m) => m.id === id)?.full_name ?? "Unknown";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const totalCollected = contributions
    .filter((c) => c.verified)
    .reduce((sum, c) => sum + Number(c.amount_gbp), 0);

  const pendingContribs = contributions.filter(
    (c) => !c.verified
  ) as PendingContribution[];
  const pendingRequests = requests.filter((r) => r.status === "pending");

  const thisMonth = new Date().getMonth();
  const paidThisMonth = contributions.filter((c) => {
    const d = new Date(c.contributed_at);
    return c.verified && d.getMonth() === thisMonth;
  }).length;
  const overdue = members.filter((m) => balanceFor(m.id) > 0).length;

  const membersWithBalance = members.map((m) => ({
    ...m,
    balance: balanceFor(m.id),
  }));

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="admin" userName={name} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight mb-1">
              Business dashboard
            </h1>
            <p className="text-gray-600">Manage payments across your group.</p>
          </div>

          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0070E0] hover:underline transition-colors"
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </Link>
        </div>

        <div className="bg-[#F7F8FA] rounded-2xl p-8 mb-6">
          <p className="text-sm text-gray-600 mb-2">Total collected</p>
          <p className="text-5xl font-black text-black tracking-tight mb-8">
            {formatUsd(totalCollected)}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#0070E0] text-white text-sm font-bold px-6 py-3 hover:bg-[#005ea6] transition-colors"
            >
              Record payment
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-300 text-black text-sm font-bold px-6 py-3 hover:bg-gray-50 transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Members</p>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-black text-black">{members.length}</p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Paid this month</p>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-black text-black">{paidThisMonth}</p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Overdue</p>
              <AlertTriangle className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-black text-black">{overdue}</p>
          </div>
        </div>

        {pendingContribs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-black mb-4">
              Pending payments
            </h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <ul>
                {pendingContribs.map((c, i) => (
                  <li
                    key={c.id}
                    className={`flex items-center gap-4 px-6 py-4 ${
                      i > 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black truncate">
                        {memberName(c.member_id)} · {c.method}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(c.contributed_at).toLocaleDateString("en-US")}
                        {c.note ? ` · ${c.note}` : ""}
                      </p>
                    </div>
                    <p className="text-base font-bold text-black whitespace-nowrap">
                      {formatUsd(Number(c.amount_gbp))}
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => verifyContribution(c.id)}
                        className="w-9 h-9 rounded-full bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0] flex items-center justify-center transition-colors"
                        aria-label="Verify"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => rejectContribution(c.id)}
                        className="w-9 h-9 rounded-full bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FECACA] flex items-center justify-center transition-colors"
                        aria-label="Reject"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {pendingRequests.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-black mb-4">
              Pending requests
            </h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <ul>
                {pendingRequests.map((r, i) => (
                  <li
                    key={r.id}
                    className={`flex items-start gap-4 px-6 py-4 ${
                      i > 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black">
                        {memberName(r.member_id)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{r.reason}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(r.created_at).toLocaleDateString("en-US")}
                      </p>
                    </div>
                    <p className="text-base font-bold text-black whitespace-nowrap pt-0.5">
                      {formatUsd(Number(r.amount_usd))}
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => resolveRequest(r.id, "approved")}
                        className="w-9 h-9 rounded-full bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0] flex items-center justify-center transition-colors"
                        aria-label="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => resolveRequest(r.id, "declined")}
                        className="w-9 h-9 rounded-full bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FECACA] flex items-center justify-center transition-colors"
                        aria-label="Decline"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <MembersTable members={membersWithBalance} />
      </main>

      <RecordPaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        members={members}
      />
    </div>
  );
}