
import React from 'react';

interface LoadingSpinnerProps {
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'w-5 h-5' }) => {
    return (
        <div
            className={`animate-spin rounded-full border-t-2 border-r-2 border-white ${className}`}
            role="status"
            aria-live="polite"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;
