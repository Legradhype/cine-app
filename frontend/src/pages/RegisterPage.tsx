import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { useApiError } from '../hooks/useApiError';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { getErrorMessage } = useApiError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({ email, password });
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
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>&#127914;</div>
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">Registrate para reservar entradas</p>
        </div>

        {error && (
          <div className="alert-cine alert-cine-danger d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="reg-email" className="form-label-cine d-block">
              Correo electrónico
            </label>
            <div className="position-relative">
              <i className="bi bi-envelope position-absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }}></i>
              <input
                id="reg-email"
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

          <div className="mb-3">
            <label htmlFor="reg-password" className="form-label-cine d-block">
              Contraseña
            </label>
            <div className="position-relative">
              <i className="bi bi-lock position-absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }}></i>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control-cine form-control"
                style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute border-0 bg-transparent"
                style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                aria-label="Mostrar contraseña"
              >
                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="reg-confirm-password" className="form-label-cine d-block">
              Confirmar contraseña
            </label>
            <div className="position-relative">
              <i className="bi bi-lock-fill position-absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }}></i>
              <input
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control-cine form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Repetí tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-accent btn w-100 py-2"
            disabled={isLoading || !email || !password || !confirmPassword}
          >
            {isLoading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Creando cuenta...</>
            ) : (
              <><i className="bi bi-person-plus me-2"></i>Crear cuenta</>  
            )}
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: '600' }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
