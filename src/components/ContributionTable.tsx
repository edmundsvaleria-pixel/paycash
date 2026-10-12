import { CheckCircle2 } from "lucide-react";
import { formatUsd } from "@/lib/currency";
import type { Contribution } from "@/types/database";

type ContributionTableProps = {
  contributions: Contribution[];
};

export default function ContributionTable({ contributions }: ContributionTableProps) {
  if (contributions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-[rgba(0,0,0,0.08)_0px_24px_48px_0px] text-center">
        <p className="text-sm text-gray-500">
          No contributions recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[rgba(0,0,0,0.08)_0px_24px_48px_0px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Method</th>
              <th className="px-6 py-4 font-medium">Note</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((c) => (
              <tr key={c.id} className="border-b border-gray-200 last:border-0">
                <td className="px-6 py-4 text-black">
                  {new Date(c.contributed_at).toLocaleDateString("en-US")}
                </td>
                <td className="px-6 py-4 text-black">{c.method}</td>
                <td className="px-6 py-4 text-gray-500">
                  {c.note || "—"}
                </td>
                <td className="px-6 py-4 text-right font-bold text-black">
                  {formatUsd(Number(c.amount_gbp))}
                </td>
                <td className="px-6 py-4 text-center">
                  {c.verified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F0F2F9] text-[#002991] text-xs font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-[#FEF3C7] text-[#92400E] text-xs font-medium">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}