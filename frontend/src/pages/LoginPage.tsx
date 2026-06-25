import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { useApiError } from '../hooks/useApiError';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { getErrorMessage } = useApiError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      login(response.accessToken, response.user);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>&#127902;</div>
          <h1 className="auth-title">Iniciar sesión</h1>
          <p className="auth-subtitle">Accede a tu cuenta de CineApp</p>
        </div>

        {error && (
          <div className="alert-cine alert-cine-danger d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label-cine d-block">
              Correo electrónico
            </label>
            <div className="position-relative">
              <i className="bi bi-envelope position-absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }}></i>
              <input
                id="login-email"
                type="email"
                className="form-control-cine form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="login-password" className="form-label-cine d-block">
              Contraseña
            </label>
            <div className="position-relative">
              <i className="bi bi-lock position-absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }}></i>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control-cine form-control"
                style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }}
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute border-0 bg-transparent"
                style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-accent btn w-100 py-2"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Iniciando sesión...</>
            ) : (
              <><i className="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión</>
            )}
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          ¿No tenés cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '600' }}>
            Registrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
