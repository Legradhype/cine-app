import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="py-4" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
        <div className="container text-center" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          <span style={{ background: 'linear-gradient(135deg, var(--color-accent), #ff8c42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700' }}>
            CineApp
          </span>
          {' '}&copy; {new Date().getFullYear()} — Sistema de Reservas
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
