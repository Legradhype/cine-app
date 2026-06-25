import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeNav = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="cine-navbar navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">&#127902; CineApp</Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
          style={{ color: 'var(--color-text-primary)', fontSize: '1.4rem' }}
        >
          <i className={`bi bi-${isOpen ? 'x-lg' : 'list'}`}></i>
        </button>

        <div className={`collapse navbar-collapse${isOpen ? ' show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end onClick={closeNav}>
                <i className="bi bi-film me-1"></i>Cartelera
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/mis-reservas" onClick={closeNav}>
                  <i className="bi bi-ticket-perforated me-1"></i>Mis Reservas
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <>
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle ${isDropdownOpen ? 'show' : ''}`}
                    href="#"
                    role="button"
                    onClick={toggleDropdown}
                    style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                  >
                    <i className="bi bi-shield-lock me-1"></i>Administración
                  </a>
                  {}
                  <ul 
                    className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} 
                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/admin/peliculas"
                        onClick={closeNav}
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        <i className="bi bi-camera-film me-2"></i>Películas
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/admin/salas"
                        onClick={closeNav}
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        <i className="bi bi-grid-3x3 me-2"></i>Salas
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/admin/funciones"
                        onClick={closeNav}
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        <i className="bi bi-calendar-event me-2"></i>Funciones
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                  <i className="bi bi-person-circle me-1"></i>
                  {user?.email}
                  {isAdmin && (
                    <span className="ms-2 badge" style={{ background: 'rgba(233,69,96,0.2)', color: 'var(--color-accent)', fontSize: '0.7rem' }}>
                      ADMIN
                    </span>
                  )}
                </span>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout} style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  <i className="bi bi-box-arrow-right me-1"></i>Salir
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-sm btn-outline-secondary me-1" to="/login" onClick={closeNav} style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  Iniciar sesión
                </Link>
                <Link className="btn-accent btn btn-sm" to="/register" onClick={closeNav}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;