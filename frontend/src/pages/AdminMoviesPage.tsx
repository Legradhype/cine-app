import React, { useState, useEffect } from 'react';
import { moviesService, CreateMoviePayload } from '../services/movies.service';
import { Movie, MovieGenre, RatingClassification } from '../types';
import { useApiError } from '../hooks/useApiError';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const GENRES = Object.values(MovieGenre);
const RATINGS = Object.values(RatingClassification);

interface FormState {
  title: string;
  synopsis: string;
  genre: MovieGenre | '';
  durationMinutes: number;
  ratingClassification: RatingClassification | '';
}

const INITIAL_FORM: FormState = {
  title: '',
  synopsis: '',
  genre: '',
  durationMinutes: 90,
  ratingClassification: '',
};

const AdminMoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingPosterId, setUploadingPosterId] = useState<number | null>(null);
  const { getErrorMessage } = useApiError();

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const data = await moviesService.getAll();
      setMovies(data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMovies();
  }, []);

  const openCreate = () => {
    setEditingMovie(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setFormSuccess('');
    setShowForm(true);
  };

  const openEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setForm({
      title: movie.title,
      synopsis: movie.synopsis,
      genre: movie.genre,
      durationMinutes: movie.durationMinutes,
      ratingClassification: movie.ratingClassification,
    });
    setFormError('');
    setFormSuccess('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMovie(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!form.genre || !form.ratingClassification) {
      setFormError('Por favor completá todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);
    const payload: CreateMoviePayload = {
      title: form.title,
      synopsis: form.synopsis,
      genre: form.genre as MovieGenre,
      durationMinutes: Number(form.durationMinutes),
      ratingClassification: form.ratingClassification,
    };

    try {
      if (editingMovie) {
        const updated = await moviesService.update(editingMovie.id, payload);
        setMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        setFormSuccess('Película actualizada exitosamente.');
      } else {
        const created = await moviesService.create(payload);
        setMovies((prev) => [created, ...prev]);
        setFormSuccess('Película creada exitosamente.');
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
      await moviesService.delete(deleteId);
      setMovies((prev) => prev.filter((m) => m.id !== deleteId));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };
  const handlePosterUpload = async (movieId: number, file: File) => {
    setUploadingPosterId(movieId);
    try {
      const updated = await moviesService.uploadPoster(movieId, file);
      setMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setUploadingPosterId(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 className="page-title">
            <i className="bi bi-camera-film me-2" style={{ color: 'var(--color-accent)' }}></i>
            Administración de Películas
          </h1>
          <p className="page-subtitle">
            {movies.length} película{movies.length !== 1 ? 's' : ''} registrada{movies.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-accent btn" onClick={openCreate}>
          <i className="bi bi-plus-circle me-2"></i>Nueva película
        </button>
      </div>
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
                    className={`bi bi-${editingMovie ? 'pencil' : 'plus-circle'} me-2`}
                    style={{ color: 'var(--color-accent)' }}
                  ></i>
                  {editingMovie ? 'Editar película' : 'Nueva película'}
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
                    <div className="col-12">
                      <label htmlFor="movie-title" className="form-label-cine d-block">Título *</label>
                      <input
                        id="movie-title"
                        type="text"
                        className="form-control-cine form-control"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                        maxLength={255}
                        placeholder="Título de la película"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="movie-genre" className="form-label-cine d-block">Género *</label>
                      <select
                        id="movie-genre"
                        className="form-select-cine form-select"
                        value={form.genre}
                        onChange={(e) => setForm({ ...form, genre: e.target.value as MovieGenre })}
                        required
                      >
                        <option value="">Seleccionar género</option>
                        {GENRES.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="movie-duration" className="form-label-cine d-block">Duración (min) *</label>
                      <input
                        id="movie-duration"
                        type="number"
                        className="form-control-cine form-control"
                        value={form.durationMinutes}
                        onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                        required
                        min={1}
                        max={600}
                      />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="movie-rating" className="form-label-cine d-block">Clasificación *</label>
                      <select
                        id="movie-rating"
                        className="form-select-cine form-select"
                        value={form.ratingClassification}
                        onChange={(e) =>
                          setForm({ ...form, ratingClassification: e.target.value as RatingClassification })
                        }
                        required
                      >
                        <option value="">Clasificación</option>
                        {RATINGS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="movie-synopsis" className="form-label-cine d-block">Sinopsis *</label>
                      <textarea
                        id="movie-synopsis"
                        className="form-control-cine form-control"
                        value={form.synopsis}
                        onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
                        required
                        rows={4}
                        maxLength={5000}
                        placeholder="Descripción de la película..."
                      />
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
                        {editingMovie ? 'Actualizar' : 'Crear película'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isLoading ? (
        <LoadingSpinner text="Cargando películas..." />
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="bi bi-camera-film"></i></div>
          <p className="empty-state-text">No hay películas registradas</p>
          <p className="empty-state-sub">Creá la primera película usando el botón de arriba</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-cine">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Título</th>
                <th>Género</th>
                <th>Duración</th>
                <th>Clasificación</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>
                    {movie.posterUrl ? (
                      <img
                        src={`http://localhost:3000${movie.posterUrl}`}
                        alt={movie.title}
                        style={{ width: '45px', height: '65px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '45px',
                          height: '65px',
                          background: 'var(--color-bg-secondary)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-text-muted)',
                          fontSize: '1.2rem',
                        }}
                      >
                        <i className="bi bi-camera-reels"></i>
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{movie.title}</span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                      {movie.synopsis.slice(0, 60)}...
                    </div>
                  </td>
                  <td>
                    <span className="badge-genre">{movie.genre}</span>
                  </td>
                  <td>{movie.durationMinutes} min</td>
                  <td>
                    <span className="movie-card-rating">{movie.ratingClassification}</span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-end flex-wrap">
                      {/* Upload poster */}
                      <label
                        htmlFor={`poster-${movie.id}`}
                        className="btn btn-sm"
                        style={{
                          cursor: 'pointer',
                          color: 'var(--color-text-secondary)',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                        }}
                        title="Subir poster"
                      >
                        {uploadingPosterId === movie.id ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <i className="bi bi-image"></i>
                        )}
                        <input
                          id={`poster-${movie.id}`}
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handlePosterUpload(movie.id, file);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>

                      <button
                        className="btn btn-sm"
                        onClick={() => openEdit(movie)}
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
                        onClick={() => setDeleteId(movie.id)}
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
        title="Eliminar película"
        message="¿Estás seguro que deseas eliminar esta película? Se eliminarán también todas sus funciones asociadas."
        confirmText="Sí, eliminar"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminMoviesPage;
