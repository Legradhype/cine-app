import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { moviesService } from '../services/movies.service';
import { reservationsService } from '../services/reservations.service';
import { Movie, Showtime, ReservationSeat, SeatPosition } from '../types';
import { useAuth } from '../context/AuthContext';
import { useApiError } from '../hooks/useApiError';
import SeatMap from '../components/SeatMap';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getErrorMessage } = useApiError();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<ReservationSeat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SeatPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchMovie = async () => {
      setIsLoading(true);
      try {
        const data = await moviesService.getById(id);
        setMovie(data);
      } catch {
        setError('No se pudo cargar la película.');
      } finally {
        setIsLoading(false);
      }
    };
    void fetchMovie();
  }, [id]);

  const handleShowtimeSelect = useCallback(async (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    setError('');
    setSuccessMessage('');
    setIsLoadingSeats(true);
    try {
      const seats = await reservationsService.getOccupiedSeats(showtime.id);
      setOccupiedSeats(seats);
    } catch {
      setError('Error al cargar los asientos.');
    } finally {
      setIsLoadingSeats(false);
    }
  }, []);

  const handleSeatToggle = (seat: SeatPosition) => {
    setSelectedSeats((prev) => {
      const exists = prev.some(
        (s) => s.rowIndex === seat.rowIndex && s.columnIndex === seat.columnIndex,
      );
      return exists
        ? prev.filter(
            (s) => !(s.rowIndex === seat.rowIndex && s.columnIndex === seat.columnIndex),
          )
        : [...prev, seat];
    });
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedShowtime || selectedSeats.length === 0) return;

    setIsReserving(true);
    setError('');

    try {
      await reservationsService.create({
        showtimeId: selectedShowtime.id,
        seats: selectedSeats,
      });
      setSuccessMessage(`¡Reserva exitosa! ${selectedSeats.length} asiento${selectedSeats.length > 1 ? 's' : ''} reservado${selectedSeats.length > 1 ? 's' : ''}.`);
      setSelectedSeats([]);
      const updatedSeats = await reservationsService.getOccupiedSeats(selectedShowtime.id);
      setOccupiedSeats(updatedSeats);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsReserving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) return <LoadingSpinner fullPage text="Cargando película..." />;

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <p style={{ color: 'var(--color-text-secondary)' }}>Película no encontrada.</p>
      </div>
    );
  }

  const posterSrc = movie.posterUrl ? `http://localhost:3000${movie.posterUrl}` : null;
  const totalAmount = selectedSeats.length * (selectedShowtime ? Number(selectedShowtime.price) : 0);

  const futureShowtimes = (movie.showtimes ?? []).filter(
    (s) => new Date(s.endTime) > new Date(),
  );

  return (
    <div style={{ background: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <div className="container py-5">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm mb-4"
          style={{ color: 'var(--color-text-secondary)', background: 'none', border: '1px solid var(--color-border)' }}
        >
          <i className="bi bi-arrow-left me-1"></i>Volver
        </button>

        {/* Movie Info */}
        <div className="row g-4 mb-5">
          <div className="col-md-3 text-center text-md-start">
            {posterSrc ? (
              <img src={posterSrc} alt={movie.title} className="movie-detail-poster" />
            ) : (
              <div className="movie-detail-poster-placeholder">
                <i className="bi bi-camera-reels"></i>
              </div>
            )}
          </div>
          <div className="col-md-9">
            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
              <span className="badge-genre">{movie.genre}</span>
              <span className="movie-card-rating">{movie.ratingClassification}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              {movie.title}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '600px' }}>
              {movie.synopsis}
            </p>
            <div className="d-flex flex-wrap gap-4">
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Duración</div>
                <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                  <i className="bi bi-clock me-1" style={{ color: 'var(--color-accent)' }}></i>
                  {movie.durationMinutes} minutos
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Género</div>
                <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                  <i className="bi bi-tag me-1" style={{ color: 'var(--color-accent)' }}></i>
                  {movie.genre}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Clasificación</div>
                <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                  {movie.ratingClassification}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes */}
        <div className="row g-4">
          <div className="col-md-4">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              <i className="bi bi-calendar3 me-2" style={{ color: 'var(--color-accent)' }}></i>
              Funciones disponibles
            </h2>

            {futureShowtimes.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <div className="empty-state-icon" style={{ fontSize: '2.5rem' }}><i className="bi bi-calendar-x"></i></div>
                <p className="empty-state-text" style={{ fontSize: '0.95rem' }}>Sin funciones disponibles</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {futureShowtimes.map((showtime) => (
                  <button
                    key={showtime.id}
                    className={`showtime-btn ${selectedShowtime?.id === showtime.id ? 'selected' : ''}`}
                    onClick={() => void handleShowtimeSelect(showtime)}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>
                      <i className="bi bi-clock me-1" style={{ color: 'var(--color-accent)' }}></i>
                      {formatTime(showtime.startTime)} — {formatTime(showtime.endTime)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {formatDate(showtime.startTime)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                      <i className="bi bi-door-open me-1"></i>
                      {showtime.room?.name ?? 'Sala'}
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--color-accent)', marginTop: '0.3rem', fontSize: '0.9rem' }}>
                      ${Number(showtime.price).toLocaleString('es-AR')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="col-md-8">
            {selectedShowtime ? (
              <>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                  <i className="bi bi-grid-3x3 me-2" style={{ color: 'var(--color-accent)' }}></i>
                  Seleccioná tus asientos
                  <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                    {selectedShowtime.room?.name}
                  </span>
                </h2>

                {error && (
                  <div className="alert-cine alert-cine-danger d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{error}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="alert-cine alert-cine-success d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{successMessage}</span>
                  </div>
                )}

                {isLoadingSeats ? (
                  <LoadingSpinner text="Cargando asientos..." />
                ) : selectedShowtime.room ? (
                  <>
                    <SeatMap
                      room={selectedShowtime.room}
                      occupiedSeats={occupiedSeats}
                      selectedSeats={selectedSeats}
                      onSeatToggle={handleSeatToggle}
                    />

                    {selectedSeats.length > 0 && (
                      <div className="total-box mt-3">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <div>
                            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                              {selectedSeats.length} asiento{selectedSeats.length > 1 ? 's' : ''} × ${Number(selectedShowtime.price).toLocaleString('es-AR')}
                            </div>
                            <div className="total-amount">${totalAmount.toLocaleString('es-AR')}</div>
                          </div>
                          <button
                            className="btn-accent btn px-4 py-2"
                            onClick={() => void handleReserve()}
                            disabled={isReserving}
                          >
                            {isReserving ? (
                              <><span className="spinner-border spinner-border-sm me-2"></span>Reservando...</>
                            ) : (
                              <><i className="bi bi-ticket-perforated me-2"></i>
                              {isAuthenticated ? 'Confirmar reserva' : 'Iniciá sesión para reservar'}</>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </>
            ) : (
              <div className="seatmap-container d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                <div className="text-center">
                  <i className="bi bi-cursor-fill" style={{ fontSize: '3rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '1rem' }}></i>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Seleccioná una función para ver los asientos</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
