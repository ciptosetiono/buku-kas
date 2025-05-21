'use client';

type Props = {
  value: string;
  placeholder?:string;
  onChange?: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function InputSearch({ value, placeholder ='search', onChange, onKeyDown, onBlur  }: Props) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={(e) => onBlur?.(e as unknown as React.KeyboardEvent<HTMLInputElement>)}
      className="mb-4 p-2 border rounded w-full max-w-md"
    />
  );
}
