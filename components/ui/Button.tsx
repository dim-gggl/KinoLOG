import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyle = "font-mono uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#e5e5e5] text-black border-[#e5e5e5] hover:bg-white hover:border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]",
    secondary: "bg-transparent text-[#e5e5e5] border-[#333] hover:border-[#e5e5e5] hover:text-white hover:bg-white/5",
    ghost: "bg-transparent text-[#888] border-transparent hover:text-[#e5e5e5]",
    danger: "bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-900/40 hover:border-red-500",
  };

  const sizes = {
    sm: "text-xs px-3 py-1",
    md: "text-xs px-6 py-3",
    lg: "text-sm px-8 py-4",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
};