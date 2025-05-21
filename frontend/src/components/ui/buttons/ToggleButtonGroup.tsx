"use client";

import React from "react";

interface ToggleButtonGroupProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
  buttonClassName?: string;
}

function ToggleButtonGroup<T extends string>({
  options,
  value,
  onChange,
  className = "",
  buttonClassName = "",
}: ToggleButtonGroupProps<T>) {
  return (
    <div className={`inline-flex rounded-lg border border-gray-300 overflow-hidden ${className}`}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 focus:outline-none transition-colors ${
              active
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-transparent text-gray-700 hover:bg-gray-100"
            } ${buttonClassName}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default ToggleButtonGroup;