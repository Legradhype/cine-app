import React, { useState, useEffect } from 'react';
import { roomsService } from '../services/rooms.service';
import { Room } from '../types';
import { useApiError } from '../hooks/useApiError';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

interface FormState {
  name: string;
  totalRows: number;
  totalColumns: number;
}

const INITIAL_FORM: FormState = { name: '', totalRows: 5, totalColumns: 8 };

const AdminRoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getErrorMessage } = useApiError();

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await roomsService.getAll();
      setRooms(data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRooms();
  }, []);

  const openCreate = () => {
    setEditingRoom(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setFormSuccess('');
    setShowForm(true);
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setForm({ name: room.name, totalRows: room.totalRows, totalColumns: room.totalColumns });
    setFormError('');
    setFormSuccess('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRoom(null);
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (editingRoom) {
        const updated = await roomsService.update(editingRoom.id, form);
        setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setFormSuccess('Sala actualizada exitosamente.');
      } else {
        const created = await roomsService.create(form);
        setRooms((prev) => [...prev, created]);
        setFormSuccess('Sala creada exitosamente.');
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
      await roomsService.delete(deleteId);
      setRooms((prev) => prev.filter((r) => r.id !== deleteId));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1 className="page-title">
            <i className="bi bi-grid-3x3 me-2" style={{ color: 'var(--color-accent)' }}></i>
            Administración de Salas
          </h1>
          <p className="page-subtitle">
            {rooms.length} sala{rooms.length !== 1 ? 's' : ''} registrada{rooms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-accent btn" onClick={openCreate}>
          <i className="bi bi-plus-circle me-2"></i>Nueva sala
        </button>
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div
          className="modal fade show d-block modal-cine"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i
                    className={`bi bi-${editingRoom ? 'pencil' : 'plus-circle'} me-2`}
                    style={{ color: 'var(--color-accent)' }}
                  ></i>
                  {editingRoom ? 'Editar sala' : 'Nueva sala'}
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

                  <div className="mb-3">
                    <label htmlFor="room-name" className="form-label-cine d-block">
                      Nombre de la sala *
                    </label>
                    <input
                      id="room-name"
                      type="text"
                      className="form-control-cine form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      maxLength={100}
                      placeholder="Ej: Sala 1, Sala VIP, Sala IMAX"
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <label htmlFor="room-rows" className="form-label-cine d-block">
                        Filas *
                      </label>
                      <input
                        id="room-rows"
                        type="number"
                        className="form-control-cine form-control"
                        value={form.totalRows}
                        onChange={(e) => setForm({ ...form, totalRows: Number(e.target.value) })}
                        required
                        min={1}
                        max={30}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="room-cols" className="form-label-cine d-block">
                        Columnas *
                      </label>
                      <input
                        id="room-cols"
                        type="number"
                        className="form-control-cine form-control"
                        value={form.totalColumns}
                        onChange={(e) => setForm({ ...form, totalColumns: Number(e.target.value) })}
                        required
                        min={1}
                        max={30}
                      />
                    </div>
                  </div>

                  {/* Vista previa de capacidad */}
                  <div
                    className="mt-3 p-3"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                      Vista previa de capacidad:
                    </p>
                    <p style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
                      <i className="bi bi-grid-3x3 me-2" style={{ color: 'var(--color-accent)' }}></i>
                      {form.totalRows} filas × {form.totalColumns} columnas ={' '}
                      <span style={{ color: 'var(--color-accent)' }}>
                        {form.totalRows * form.totalColumns} asientos
                      </span>
                    </p>
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
                        {editingRoom ? 'Actualizar sala' : 'Crear sala'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lista de salas */}
      {isLoading ? (
        <LoadingSpinner text="Cargando salas..." />
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-grid-3x3"></i>
          </div>
          <p className="empty-state-text">No hay salas registradas</p>
          <p className="empty-state-sub">Creá la primera sala usando el botón de arriba</p>
        </div>
      ) : (
        <div className="row g-3">
          {rooms.map((room) => (
            <div className="col-md-6 col-lg-4" key={room.id}>
              <div className="cine-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
                      <i className="bi bi-door-open me-2" style={{ color: 'var(--color-accent)' }}></i>
                      {room.name}
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem', marginBottom: 0 }}>
                      {room.totalRows} filas × {room.totalColumns} columnas
                    </p>
                  </div>
                  <span
                    style={{
                      background: 'rgba(233,69,96,0.1)',
                      color: 'var(--color-accent)',
                      padding: '0.25rem 0.7rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      border: '1px solid rgba(233,69,96,0.2)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {room.totalRows * room.totalColumns} asientos
                  </span>
                </div>

                {/* Mini grid visual */}
                <div className="mt-3" style={{ overflowX: 'auto' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(room.totalColumns, 12)}, 1fr)`,
                      gap: '3px',
                      opacity: 0.5,
                    }}
                  >
                    {Array.from({ length: Math.min(room.totalRows * room.totalColumns, 36) }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          height: '8px',
                          background: 'rgba(46,204,113,0.4)',
                          borderRadius: '2px',
                        }}
                      />
                    ))}
                  </div>
                  {room.totalRows * room.totalColumns > 36 && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px', marginBottom: 0 }}>
                      ... y {room.totalRows * room.totalColumns - 36} asientos más
                    </p>
                  )}
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-sm flex-fill"
                    onClick={() => openEdit(room)}
                    style={{
                      color: 'var(--color-text-secondary)',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                    }}
                  >
                    <i className="bi bi-pencil me-1"></i>Editar
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => setDeleteId(room.id)}
                    style={{
                      color: 'var(--color-danger)',
                      background: 'rgba(231,76,60,0.1)',
                      border: '1px solid rgba(231,76,60,0.3)',
                      borderRadius: '6px',
                    }}
                    title="Eliminar sala"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        show={!!deleteId}
        title="Eliminar sala"
        message="¿Estás seguro que deseas eliminar esta sala? Se eliminarán también todas las funciones programadas en ella."
        confirmText="Sí, eliminar"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminRoomsPage;
