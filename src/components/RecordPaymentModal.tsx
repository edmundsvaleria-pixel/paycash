"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

type RecordPaymentModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  members: Profile[];
};

export default function RecordPaymentModal({
  open,
  onClose,
  onSaved,
  members,
}: RecordPaymentModalProps) {
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"MoMo" | "Cash" | "Bank" | "Other">("MoMo");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!memberId) return setError("Select a member.");
    const amt = Number(amount);
    if (!amt || amt <= 0) return setError("Enter a valid amount.");

    setSaving(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("contributions").insert({
      member_id: memberId,
      amount_gbp: amt,
      method,
      note,
      contributed_at: new Date(date).toISOString(),
      verified: true,
      verified_at: new Date().toISOString(),
    });
    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setMemberId("");
    setAmount("");
    setNote("");
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 relative my-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-black text-black tracking-tight mb-1">
          Record payment
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          Add a payment that was made outside Paypal.
        </p>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Member
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-black focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
              required
            >
              <option value="">Select a member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Amount (USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50.00"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-black placeholder-gray-400 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as typeof method)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-black focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
            >
              <option value="MoMo">MoMo</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-black focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-black placeholder-gray-400 focus:border-[#0070E0] focus:outline-none focus:ring-1 focus:ring-[#0070E0]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-[#0070E0] text-white text-base font-bold py-4 transition-colors hover:bg-[#005ea6] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save payment"}
          </button>
        </form>
      </div>
    </div>
  );
}