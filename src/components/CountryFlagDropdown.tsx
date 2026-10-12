"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type Country = {
  code: string;
  name: string;
};

export const COUNTRIES: Country[] = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "gh", name: "Ghana" },
  { code: "ng", name: "Nigeria" },
  { code: "za", name: "South Africa" },
  { code: "ke", name: "Kenya" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "es", name: "Spain" },
  { code: "it", name: "Italy" },
  { code: "nl", name: "Netherlands" },
  { code: "ie", name: "Ireland" },
  { code: "au", name: "Australia" },
  { code: "in", name: "India" },
  { code: "br", name: "Brazil" },
  { code: "mx", name: "Mexico" },
  { code: "jp", name: "Japan" },
  { code: "cn", name: "China" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "sg", name: "Singapore" },
  { code: "ph", name: "Philippines" },
  { code: "pk", name: "Pakistan" },
  { code: "bd", name: "Bangladesh" },
  { code: "eg", name: "Egypt" },
];

function FlagIcon({ code, size = 24 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={code.toUpperCase()}
      width={size}
      height={Math.round(size * 0.75)}
      className="rounded-sm object-cover flex-shrink-0"
      style={{ width: size, height: Math.round(size * 0.75) }}
    />
  );
}

type CountryFlagDropdownProps = {
  country: Country;
  onSelect: (country: Country) => void;
};

export default function CountryFlagDropdown({
  country,
  onSelect,
}: CountryFlagDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-[#0070E0] bg-white transition-colors hover:bg-gray-50"
      >
        <FlagIcon code={country.code} size={26} />
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-700" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-700" />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[280px] max-h-[500px] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-[rgba(0,0,0,0.15)_0px_12px_32px] z-50">
          <div className="p-2">
            {COUNTRIES.map((c) => {
              const isSelected = c.code === country.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onSelect(c);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg text-left transition-colors ${
                    isSelected
                      ? "border-2 border-[#0070E0] bg-white"
                      : "border-2 border-transparent hover:bg-gray-50"
                  }`}
                >
                  <FlagIcon code={c.code} size={24} />
                  <span className="text-base text-black font-medium truncate">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}