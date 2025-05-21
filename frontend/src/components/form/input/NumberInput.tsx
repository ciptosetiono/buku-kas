// components/RupiahInput.tsx
"use client"; // if you're using App Router

import React from "react";
import { NumericFormat } from 'react-number-format';

const NumberInput = ({ value, onValueChange }: {
  value: number | undefined;
  onValueChange: (value: number | undefined) => void;
}) => {
  return (
    <NumericFormat
      value={value}
      thousandSeparator="."
      decimalSeparator=","
      prefix="Rp "
      allowNegative={false}
      decimalScale={2}
      fixedDecimalScale={true}
      valueIsNumericString={true}
      className="border px-2 py-1 rounded w-full"
      placeholder="Rp 0,00"
      onValueChange={(values) => {
        onValueChange(values.floatValue);
      }}
    />
  );
};

export default NumberInput;
