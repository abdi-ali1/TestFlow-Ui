import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  onClick,
  disabled = false,
  small = false,
  className = '',
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50";
  
  const variantClasses = {
    primary: "glass-button-primary",
    secondary: "glass-button-secondary",
    ghost: "text-gray-400 hover:text-gray-200 hover:bg-dark-400/30"
  };
  
  const sizeClasses = small ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm";
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;