import React, { useState, useEffect, useCallback } from 'react';
import { moviesService } from '../services/movies.service';
import { Movie, MovieGenre } from '../types';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const ITEMS_PER_PAGE = 12;

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedTitle, setDebouncedTitle] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTitle(searchTitle);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTitle]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre]);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await moviesService.getAll(
        debouncedTitle || undefined,
        (selectedGenre as MovieGenre) || undefined,
      );
      setMovies(data);
    } catch {
      setError('Error al cargar la cartelera. Intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedTitle, selectedGenre]);

  useEffect(() => {
    void fetchMovies();
  }, [fetchMovies]);

  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const paginatedMovies = movies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div>
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Cartelera</h1>
          <p className="hero-subtitle">Descubrí las mejores películas y reservá tus entradas</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="search-bar-container">
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <SearchBar
                value={searchTitle}
                onChange={setSearchTitle}
                placeholder="Buscar película por título..."
              />
            </div>
            <div className="col-md-4">
              <GenreFilter value={selectedGenre} onChange={setSelectedGenre} />
            </div>
          </div>
          {(searchTitle || selectedGenre) && (
            <div className="mt-2 d-flex align-items-center gap-2">
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                {movies.length} resultado{movies.length !== 1 ? 's' : ''}
              </span>
              <button
                className="btn btn-sm"
                onClick={() => { setSearchTitle(''); setSelectedGenre(''); }}
                style={{ color: 'var(--color-accent)', fontSize: '0.8rem', background: 'none', border: 'none', padding: '0' }}
              >
                <i className="bi bi-x-circle me-1"></i>Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner text="Cargando cartelera..." />
        ) : error ? (
          <div className="alert-cine alert-cine-danger text-center p-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        ) : paginatedMovies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="bi bi-camera-reels"></i></div>
            <p className="empty-state-text">No se encontraron películas</p>
            <p className="empty-state-sub">
              {searchTitle || selectedGenre
                ? 'Probá con otros filtros de búsqueda'
                : 'No hay películas disponibles en este momento'}
            </p>
          </div>
        ) : (
          <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {paginatedMovies.map((movie) => (
                <div className="col" key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-5">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}
                      style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                        style={{
                          background: page === currentPage ? 'var(--color-accent)' : 'var(--color-bg-card)',
                          border: `1px solid ${page === currentPage ? 'var(--color-accent)' : 'var(--color-border)'}`,
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}
                      style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
