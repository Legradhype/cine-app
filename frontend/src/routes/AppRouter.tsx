import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MoviesPage from '../pages/MoviesPage';
import MovieDetailPage from '../pages/MovieDetailPage';
import MyReservationsPage from '../pages/MyReservationsPage';
import AdminMoviesPage from '../pages/AdminMoviesPage';
import AdminRoomsPage from '../pages/AdminRoomsPage';
import AdminShowtimesPage from '../pages/AdminShowtimesPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<MoviesPage />} />
        <Route path="movies/:id" element={<MovieDetailPage />} />
        <Route
          path="mis-reservas"
          element={
            <ProtectedRoute>
              <MyReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/peliculas"
          element={
            <AdminRoute>
              <AdminMoviesPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/salas"
          element={
            <AdminRoute>
              <AdminRoomsPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/funciones"
          element={
            <AdminRoute>
              <AdminShowtimesPage />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
