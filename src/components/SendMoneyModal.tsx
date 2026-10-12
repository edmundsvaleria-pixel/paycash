"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SendMoneyModalProps = {
  open: boolean;
  onClose: () => void;
  onSent: () => void;
  memberId: string;
};

export default function SendMoneyModal({
  open,
  onClose,
  onSent,
  memberId,
}: SendMoneyModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"MoMo" | "Cash" | "Bank" | "Other">("MoMo");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const amt = Number(amount);
    if (!amt || amt <= 0) return setError("Enter a valid amount.");

    setSaving(true);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("contributions").insert({
      member_id: memberId,
      amount_gbp: amt,
      method,
      note,
      contributed_at: new Date().toISOString(),
      verified: false,
    });
    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setAmount("");
    setNote("");
    onSent();
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
          Send money
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          Log a payment you've made to the group. The admin will confirm it.
        </p>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-5">
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
            {saving ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}