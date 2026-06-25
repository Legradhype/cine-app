import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ fontSize: '6rem', marginBottom: '1rem', opacity: 0.3 }}>&#127903;</div>
      <h1 style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1 }}>404</h1>
      <h2 style={{ color: 'var(--color-text-primary)', fontWeight: 700, margin: '1rem 0 0.5rem' }}>Página no encontrada</h2>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', marginBottom: '2rem' }}>
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/" className="btn-accent btn px-4 py-2">
        <i className="bi bi-house me-2"></i>Volver a la cartelera
      </Link>
    </div>
  );
};

export default NotFoundPage;
