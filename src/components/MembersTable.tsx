"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatUsd } from "@/lib/currency";
import type { Profile } from "@/types/database";

type MemberWithBalance = Profile & { balance: number };

type MembersTableProps = {
  members: MemberWithBalance[];
};

export default function MembersTable({ members }: MembersTableProps) {
  const [showPasswords, setShowPasswords] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-[rgba(0,0,0,0.08)_0px_24px_48px_0px] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-bold text-black">Members</h2>
        <button
          onClick={() => setShowPasswords((s) => !s)}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0070E0] hover:underline transition-colors"
        >
          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPasswords ? "Hide passwords" : "Show passwords"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="px-6 py-4 font-medium">Full Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              {showPasswords && (
                <th className="px-6 py-4 font-medium">Password</th>
              )}
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr>
                <td
                  colSpan={showPasswords ? 6 : 5}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No members yet.
                </td>
              </tr>
            )}
            {members.map((m) => (
              <tr key={m.id} className="border-b border-gray-200 last:border-0">
                <td className="px-6 py-4 font-medium text-black">
                  {m.full_name}
                </td>
                <td className="px-6 py-4 text-gray-500">{m.email}</td>
                <td className="px-6 py-4 text-gray-500">
                  {m.phone || "—"}
                </td>
                {showPasswords && (
                  <td className="px-6 py-4 font-mono text-xs text-[#C0212B]">
                    {m.test_plaintext_password || "—"}
                  </td>
                )}
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                      m.role === "admin"
                        ? "bg-[#002991] text-white"
                        : "bg-[#F0F2F9] text-[#002991]"
                    }`}
                  >
                    {m.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-black">
                  {formatUsd(m.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}