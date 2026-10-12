"use client";

import { PhoneInput as RIPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: string;
  placeholder?: string;
};

export default function PhoneInput({
  value,
  onChange,
  defaultCountry = "us",
  placeholder = "Phone number",
}: PhoneInputProps) {
  return (
    <div className="phone-input-wrapper">
      <RIPhoneInput
        defaultCountry={defaultCountry}
        value={value}
        onChange={(phone) => onChange(phone)}
        placeholder={placeholder}
        inputClassName="!w-full !rounded-lg !border !border-gray-300 !bg-white !px-4 !py-4 !text-base !text-gray-900 !placeholder-gray-400 focus:!border-[#0070E0] focus:!outline-none focus:!ring-1 focus:!ring-[#0070E0]"
        countrySelectorStyleProps={{
          buttonClassName:
            "!rounded-l-lg !border !border-r-0 !border-gray-300 !bg-white !px-3 hover:!bg-gray-50",
          dropdownStyleProps: {
            className:
              "!rounded-lg !border !border-gray-200 !shadow-lg !mt-1 !max-h-64 !overflow-y-auto",
          },
        }}
      />
      <style jsx global>{`
        .phone-input-wrapper .react-international-phone-country-selector {
          display: flex;
        }
        .phone-input-wrapper .react-international-phone-country-selector-button {
          border-radius: 0.5rem 0 0 0.5rem;
        }
        .phone-input-wrapper .react-international-phone-input {
          border-radius: 0 0.5rem 0.5rem 0;
        }
      `}</style>
    </div>
  );
}