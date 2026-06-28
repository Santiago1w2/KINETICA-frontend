import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: number; // Size in pixels
  color?: string; // Hex or color string
}

export default function LoadingSpinner({ size = 50, color = '#3498db' }: SpinnerProps) {
  return (
    <div className="spinner-container">
      <div 
        className="loading-spinner" 
        style={{ 
          width: size, 
          height: size, 
          borderTopColor: color 
        }}
      />
    </div>
  );
}