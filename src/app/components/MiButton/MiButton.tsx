"use client";
import React from "react";
import { useLanguage } from '@/contexts/LanguageContext';

export interface MiButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  text?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
}

/**
 * Botón reutilizable principal de la app.
 * Estilo base: fondo negro, texto blanco → hover blanco con texto negro.
 */
export const MiButton: React.FC<MiButtonProps> = ({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  leftIcon,
  rightIcon,
  text = "Botón",
  type = "button",
  className = "",
}) => {
  const { t } = useLanguage();
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    primary:
      "border border-black bg-black text-white hover:bg-white hover:text-black",
    secondary:
      "border border-gray-400 bg-white text-black hover:bg-black hover:text-white",
    danger:
      "bg-red-600 border border-red-600 text-white hover:bg-white hover:text-red-600",
  };

  const sizes: Record<string, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {loading ? (t('ui.loading') || 'Cargando...') : text}
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
};
