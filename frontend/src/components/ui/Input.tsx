import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`adotai-form-control ${className}`.trim()}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
