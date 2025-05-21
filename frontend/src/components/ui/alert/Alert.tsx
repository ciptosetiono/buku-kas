"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  showLink = false,
  linkHref = "#",
  linkText = "Learn more",
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const variantClasses = {
    success: "border-success-500 bg-success-50 text-success-600 dark:border-success-500/30 dark:bg-success-500/15",
    error: "border-error-500 bg-error-50 text-error-600 dark:border-error-500/30 dark:bg-error-500/15",
    warning: "border-warning-500 bg-warning-50 text-warning-600 dark:border-warning-500/30 dark:bg-warning-500/15",
    info: "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/15",
  };

  const icon = {
    success: "✔️",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  }[variant];

  return (
    <div
      className={`relative flex items-start gap-4 rounded-lg border p-4 ${variantClasses[variant]}`}
    >
      <div className="text-xl">{icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-sm mt-1">{message}</p>
        {showLink && (
          <Link
            href={linkHref}
            className="text-sm text-blue-600 hover:underline mt-2 inline-block"
          >
            {linkText}
          </Link>
        )}
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Alert;
