import React, { useState, useEffect, useCallback } from 'react';
import { showtimesService, CreateShowtimePayload } from '../services/showtimes.service';
import { moviesService } from '../services/movies.service';
import { roomsService } from '../services/rooms.service';
import { Showtime, Movie, Room, ShowtimeStatus } from '../types';
import { useApiError } from '../hooks/useApiError';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

interface FormState {
  movieId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  price: number;
  status: ShowtimeStatus;
}

const INITIAL_FORM: FormState = {
  movieId: '',
  roomId: '',
  startTime: '',
  endTime: '',
  price: 1500,
  status: ShowtimeStatus.SCHEDULED,
};

const STATUS_LABELS: Record<ShowtimeStatus, string> = {
  [ShowtimeStatus.SCHEDULED]: 'Programada',
  [ShowtimeStatus.ACTIVE]: 'Activa',
  [ShowtimeStatus.FINISHED]: 'Finalizada',
  [ShowtimeStatus.CANCELLED]: 'Cancelada',
};

const AdminShowtimesPage: React.FC = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getErrorMessage } = useApiError();

  const toLocalDatetimeInput = (dateStr: string): string => {
    const d = new Date(dateStr);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [showtimesData, moviesData, roomsData] = await Promise.all([
        showtimesService.getAll(),
        moviesService.getAll(),
        roomsService.getAll(),
      ]);
      setShowtimes(showtimesData);
      setMovies(moviesData);
      setRooms(roomsData);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const openCreate = () => {
    setEditingShowtime(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setFormSuccess('');
    setShowForm(true);
  };

  const openEdit = (showtime: Showtime) => {
    setEditingShowtime(showtime);
    setForm({
      movieId: showtime.movieId,
      roomId: showtime.roomId,
      startTime: toLocalDatetimeInput(showtime.startTime),
      endTime: toLocalDatetimeInput(showtime.endTime),
      price: Number(showtime.price),
      status: showtime.status,
    });
    setFormError('');
    setFormSuccess('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingShowtime(null);
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!form.movieId || !form.roomId || !form.startTime || !form.endTime) {
      setFormError('Por favor completá todos los campos requeridos.');
      return;
    }

    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setFormError('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    setIsSubmitting(true);

    const payload: CreateShowtimePayload = {
      movieId: form.movieId,
      roomId: form.roomId,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      price: Number(form.price),
      status: form.status,
    };

    try {
      if (editingShowtime) {
        const updated = await showtimesService.update(editingShowtime.id, payload);
        setShowtimes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setFormSuccess('Función actualizada exitosamente.');
      } else {
        const created = await showtimesService.create(payload);
        setShowtimes((prev) => [created, ...prev]);
        setFormSuccess('Función creada exitosamente.');
        setForm(INITIAL_FORM);
      }
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await showtimesService.delete(deleteId);
      setShowtimes((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: ShowtimeStatus) => {
    const colors: Record<ShowtimeStatus, { bg: string; color: string }> = {
      [ShowtimeStatus.SCHEDULED]: { bg: 'rgba(243,156,18,0.15)', color: 'var(--color-warning)' },
      [ShowtimeStatus.ACTIVE]: { bg: 'rgba(46,204,113,0.15)', color: 'var(--color-success)' },
      [ShowtimeStatus.FINISHED]: { bg: 'rgba(96,96,112,0.3)', color: 'var(--color-text-muted)' },
      [ShowtimeStatus.CANCELLED]: { bg: 'rgba(231,76,60,0.15)', color: 'var(--color-danger)' },
    };
    const c = colors[status];
    return (
      <span
        style={{
          background: c.bg,
          color: c.color,
          padding: '0.2rem 0.6rem',
          borderRadius: '6px',
          fontSize: '0.78rem',
          fontWeight: 600,
        }}
      >
        {STATUS_LABELS[status]}
      </span>
    );
  };

  return (
    <div className="container py-5">
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 className="page-title">
            <i className="bi bi-calendar-event me-2" style={{ color: 'var(--color-accent)' }}></i>
            Administración de Funciones
          </h1>
          <p className="page-subtitle">
            {showtimes.length} función{showtimes.length !== 1 ? 'es' : ''} registrada{showtimes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-accent btn" onClick={openCreate}>
          <i className="bi bi-plus-circle me-2"></i>Nueva función
        </button>
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div
          className="modal fade show d-block modal-cine"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i
                    className={`bi bi-${editingShowtime ? 'pencil' : 'plus-circle'} me-2`}
                    style={{ color: 'var(--color-accent)' }}
                  ></i>
                  {editingShowtime ? 'Editar función' : 'Nueva función'}
                </h5>
                <button type="button" className="btn-close" onClick={closeForm} aria-label="Cerrar"></button>
              </div>

              <form onSubmit={(e) => void handleSubmit(e)}>
                <div className="modal-body">
                  {formError && (
                    <div className="alert-cine alert-cine-danger mb-3">
                      <i className="bi bi-exclamation-circle me-2"></i>{formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="alert-cine alert-cine-success mb-3">
                      <i className="bi bi-check-circle me-2"></i>{formSuccess}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="showtime-movie" className="form-label-cine d-block">
                        Película *
                      </label>
                      <select
                        id="showtime-movie"
                        className="form-select-cine form-select"
                        value={form.movieId}
                        onChange={(e) => setForm({ ...form, movieId: e.target.value })}
                        required
                      >
                        <option value="">Seleccionar película</option>
                        {movies.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.title} ({m.durationMinutes} min)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="showtime-room" className="form-label-cine d-block">
                        Sala *
                      </label>
                      <select
                        id="showtime-room"
                        className="form-select-cine form-select"
                        value={form.roomId}
                        onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                        required
                      >
                        <option value="">Seleccionar sala</option>
                        {rooms.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.totalRows * r.totalColumns} asientos)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="showtime-start" className="form-label-cine d-block">
                        Fecha y hora de inicio *
                      </label>
                      <input
                        id="showtime-start"
                        type="datetime-local"
                        className="form-control-cine form-control"
                        value={form.startTime}
                        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="showtime-end" className="form-label-cine d-block">
                        Fecha y hora de fin *
                      </label>
                      <input
                        id="showtime-end"
                        type="datetime-local"
                        className="form-control-cine form-control"
                        value={form.endTime}
                        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="showtime-price" className="form-label-cine d-block">
                        Precio de entrada *
                      </label>
                      <div className="position-relative">
                        <span
                          style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-accent)',
                            fontWeight: 700,
                            pointerEvents: 'none',
                          }}
                        >
                          $
                        </span>
                        <input
                          id="showtime-price"
                          type="number"
                          className="form-control-cine form-control"
                          style={{ paddingLeft: '1.8rem' }}
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                          required
                          min={0}
                          step={50}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="showtime-status" className="form-label-cine d-block">
                        Estado *
                      </label>
                      <select
                        id="showtime-status"
                        className="form-select-cine form-select"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as ShowtimeStatus })}
                        required
                      >
                        {Object.values(ShowtimeStatus).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeForm}
                    disabled={isSubmitting}
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-accent btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {editingShowtime ? 'Actualizar función' : 'Crear función'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lista de funciones */}
      {isLoading ? (
        <LoadingSpinner text="Cargando funciones..." />
      ) : showtimes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-calendar-x"></i>
          </div>
          <p className="empty-state-text">No hay funciones programadas</p>
          <p className="empty-state-sub">Creá la primera función usando el botón de arriba</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-cine">
            <thead>
              <tr>
                <th>Película</th>
                <th>Sala</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Precio</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map((showtime) => (
                <tr key={showtime.id}>
                  <td>
                    <span style={{ fontWeight: 600 }}>{showtime.movie?.title ?? '—'}</span>
                    {showtime.movie && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {showtime.movie.durationMinutes} min · {showtime.movie.genre}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{showtime.room?.name ?? '—'}</span>
                    {showtime.room && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {showtime.room.totalRows * showtime.room.totalColumns} asientos
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{formatDateTime(showtime.startTime)}</td>
                  <td style={{ fontSize: '0.85rem' }}>{formatDateTime(showtime.endTime)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                    ${Number(showtime.price).toLocaleString('es-AR')}
                  </td>
                  <td>{getStatusBadge(showtime.status)}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        className="btn btn-sm"
                        onClick={() => openEdit(showtime)}
                        style={{
                          color: 'var(--color-text-secondary)',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                        }}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => setDeleteId(showtime.id)}
                        style={{
                          color: 'var(--color-danger)',
                          background: 'rgba(231,76,60,0.1)',
                          border: '1px solid rgba(231,76,60,0.3)',
                          borderRadius: '6px',
                        }}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        show={!!deleteId}
        title="Eliminar función"
        message="¿Estás seguro que deseas eliminar esta función? Se eliminarán también todas las reservas asociadas."
        confirmText="Sí, eliminar"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminShowtimesPage;
