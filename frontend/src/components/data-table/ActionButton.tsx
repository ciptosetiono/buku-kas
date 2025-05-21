import React, { ReactNode } from "react";


interface ActionButtonProps {
  children: ReactNode; // Button text or content
  size?: "xs" | "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  color?: string;
  className?: string;
  icon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  size = "xs",
  variant = "primary",
  color = "blue",
  icon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    xs: "px-2 py-1.5 text-xs",
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
   primary:
    `bg-${color}-500 text-white shadow-theme-xs hover:bg-${color}-600 disabled:bg-${color}-600`,
   outline:
    `bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300`,
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
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};


export const AddButton = ({onClick, children}: {onClick?: () => void, children: React.ReactNode}) => {
  return (
    <div className="flex justify-end mb-4">
        <ActionButton
          color="green"
          variant="primary"
          size="sm"
          onClick={onClick}
        >
          {children}
        </ActionButton>
    </div>
  );
}

export default ActionButton;
