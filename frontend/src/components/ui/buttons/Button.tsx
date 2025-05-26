"use client";

import React, { ReactNode } from "react";
import { clsx } from "clsx";
import LoaderSpinner from "../loader/LoaderSpinner";

type AvailableColors = "blue" | "red" | "green" | "gray" | "aqua" | "orange";
type ButtonSize = "sm" | "md" | "lg" | "xl";
type ButtonVariant = "primary" | "outline" | "ghost" | "link" | "danger";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: AvailableColors;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
  xl: "px-6 py-4 text-lg",
};

const variantClasses = {
  primary: {
    blue: "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-600 text-white shadow-theme-xs",
    red: "bg-red-500 hover:bg-red-600 disabled:bg-red-600 text-white shadow-theme-xs",
    green: "bg-green-500 hover:bg-green-600 disabled:bg-green-600 text-white shadow-theme-xs",
    gray: "bg-gray-500 hover:bg-gray-600 disabled:bg-gray-600 text-white shadow-theme-xs",
    aqua: "bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-600 text-white shadow-theme-xs",
    orange: "bg-orange-500 hover:bg-orange-600 disabled:bg-orange-600 text-white shadow-theme-xs",
  },
  ghost: {
    blue: "bg-transparent text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/10",
    red: "bg-transparent text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10",
    green: "bg-transparent text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/10",
    gray: "bg-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900/10",
    aqua: "bg-transparent text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/10",
    orange: "bg-transparent text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/10",
  },
  outline:
    "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",

  link: "bg-transparent text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",

  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-700",
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  size = "md",
  variant = "primary",
  color = "blue",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
}) => {
  const baseClass =
    "inline-flex items-center justify-center font-medium gap-2 rounded-lg transition";

  let variantClass = "";

  if (variant === "primary" || variant === "ghost") {
    variantClass = variantClasses[variant][color] || variantClasses[variant].blue;
  } else {
    variantClass = variantClasses[variant];
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseClass,
        sizeClasses[size],
        variantClass,
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <>
          {startIcon && <span className="flex items-center">{startIcon}</span>}
          {children}
          {endIcon && <span className="flex items-center">{endIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
