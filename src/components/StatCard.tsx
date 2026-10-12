import { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  subtext?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "error";
};

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-black",
  success: "text-[#007A56]",
  warning: "text-[#F59E0B]",
  error: "text-[#C0212B]",
};

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[rgba(0,0,0,0.08)_0px_24px_48px_0px]">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-[#686A6D]">{label}</p>
        {Icon && <Icon className="h-5 w-5 text-[#686A6D]" />}
      </div>
      <p className={`mt-3 text-3xl font-black tracking-tight ${toneStyles[tone]}`}>
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-xs text-[#686A6D]">{subtext}</p>
      )}
    </div>
  );
}