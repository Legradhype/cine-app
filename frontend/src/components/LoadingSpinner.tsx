import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Cargando...',
  fullPage = false,
}) => {
  const containerStyle = fullPage
    ? {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)',
      }
    : {};

  return (
    <div className="loading-container" style={containerStyle}>
      <div className="spinner-cine"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
