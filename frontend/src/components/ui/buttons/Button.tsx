"use client"

import React, { ReactNode } from "react";
import LoaderSpinner from "../loader/LoaderSpinner";

type AvailableColors = "blue" | "red" | "green" | "gray" | "aqua" | "orange";

interface ButtonProps {
  children: ReactNode; // Button text or content
  type?: "button" | "submit" | "reset"; // Button type  
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "ghost"; // Button variant
  color?: AvailableColors;
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  isLoading?: boolean; // Loading state
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
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

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }
  , []);
  if (!isMounted) {
    return null;
  }
  
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  const colorMap: Record<AvailableColors, string> = {
    blue: "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600 disabled:bg-red-600",
    green: "bg-green-500 hover:bg-green-600 disabled:bg-green-600",
    gray: "bg-gray-500 hover:bg-gray-600 disabled:bg-gray-600",
    aqua: "bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-600", // Tailwind uses 'cyan' not 'aqua'
    orange: "bg-orange-500 hover:bg-orange-600 disabled:bg-orange-600",
    // Add more colors as needed
  };
  
  const variantClasses = {
    primary: `${colorMap[color] || colorMap.blue} text-white shadow-theme-xs`,
    outline: "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    ghost: `bg-transparent text-${color}-600 hover:bg-${color}-50 dark:text-${color}-400 dark:hover:bg-${color}-900/10`,
  };



  return (
    <button
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type? type : "button"}
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
