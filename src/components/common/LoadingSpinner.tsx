import React from "react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 32, className = "", label }) => {
  const style = { width: size, height: size } as const;
  return (
    <div className={`flex items-center justify-center ${className}`} aria-live="polite" aria-busy="true">
      <div
        className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
        style={style}
        role="status"
      />
      {label && <span className="ml-3 text-sm text-gray-600">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
