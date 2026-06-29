import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  title,
  ...props
}: ButtonProps) {
  const baseClasses = `adotai-btn ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`;

  const variantClasses = {
    primary: 'adotai-btn-primary font-btnPrimary font-normal',
    secondary: 'adotai-btn-secondary font-btnSecondary font-extrabold borda-pelos',
    destructive: 'adotai-btn-destructive font-btnPrimary font-normal',
  };

  const tooltipTexto = title || (typeof children === 'string' ? children : undefined);

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      title={tooltipTexto}
      {...props}
    >
      {children}
    </button>
  );
}
