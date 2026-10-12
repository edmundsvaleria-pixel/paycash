"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { langLabels, Lang } from "@/lib/i18n";

const ORDER: Lang[] = ["en", "fr", "es", "zh"];

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="text-center text-sm text-gray-600 mt-8 pb-12">
      {ORDER.map((l, i) => (
        <span key={l}>
          {i > 0 && <span className="mx-2 text-gray-300">|</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            className={
              l === lang
                ? "font-bold text-gray-800"
                : "text-gray-600 hover:text-gray-800 transition-colors"
            }
          >
            {langLabels[l]}
          </button>
        </span>
      ))}
    </div>
  );
}