import React, { useState, useEffect } from 'react';
import { reservationsService } from '../services/reservations.service';
import { Reservation, ReservationStatus } from '../types';
import { useApiError } from '../hooks/useApiError';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const MyReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  

  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [isCancelling, setIsCancelling] = useState(false);
  const { getErrorMessage } = useApiError();

  const fetchReservations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await reservationsService.getMyReservations();
      setReservations(data);
    } catch {
      setError('Error al cargar tus reservas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchReservations();
  }, []);

  const handleCancelRequest = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedId) return;
    setIsCancelling(true);
    setCancellingId(selectedId);
    try {
      await reservationsService.cancel(selectedId);
      setReservations((prev) =>
        prev.map((r) =>
          r.id === selectedId ? { ...r, status: ReservationStatus.CANCELLED } : r,
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsCancelling(false);
      setCancellingId(null);
      setSelectedId(null);
      setShowConfirm(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return <span className="badge-status-confirmed"><i className="bi bi-check-circle me-1"></i>Confirmada</span>;
      case ReservationStatus.CANCELLED:
        return <span className="badge-status-cancelled"><i className="bi bi-x-circle me-1"></i>Cancelada</span>;
      case ReservationStatus.PENDING:
        return <span className="badge-status-pending"><i className="bi bi-clock me-1"></i>Pendiente</span>;
    }
  };

  const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className="container py-5">
      <div className="page-header">
        <h1 className="page-title">
          <i className="bi bi-ticket-perforated me-2" style={{ color: 'var(--color-accent)' }}></i>
          Mis Reservas
        </h1>
        <p className="page-subtitle">Historial de entradas reservadas</p>
      </div>

      {error && (
        <div className="alert-cine alert-cine-danger mb-4">
          <i className="bi bi-exclamation-circle me-2"></i>{error}
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner text="Cargando reservas..." />
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="bi bi-ticket-perforated"></i></div>
          <p className="empty-state-text">No tenés reservas aún</p>
          <p className="empty-state-sub">Visitá la cartelera y reservá tus entradas</p>
        </div>
      ) : (
        <div>
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-card-header">
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '1rem' }}>
                    {reservation.showtime?.movie?.title ?? 'Película'}
                  </span>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    ID: {reservation.id.toString().padStart(5, '0')}
                  </div>
                </div>
                {getStatusBadge(reservation.status)}
              </div>
              <div className="reservation-card-body">
                <div className="row g-3">
                  <div className="col-sm-6 col-md-3">
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha y hora</div>
                    <div style={{ color: 'var(--color-text-primary)', fontWeight: 500, marginTop: '0.3rem', fontSize: '0.9rem' }}>
                      {reservation.showtime ? formatDateTime(reservation.showtime.startTime) : '-'}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-2">
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sala</div>
                    <div style={{ color: 'var(--color-text-primary)', fontWeight: 500, marginTop: '0.3rem', fontSize: '0.9rem' }}>
                      {reservation.showtime?.room?.name ?? '-'}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Asientos</div>
                    <div style={{ marginTop: '0.3rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {reservation.seats.map((seat) => (
                        <span
                          key={seat.id}
                          style={{
                            background: 'rgba(233,69,96,0.1)',
                            border: '1px solid rgba(233,69,96,0.25)',
                            borderRadius: '4px',
                            padding: '0.1rem 0.4rem',
                            fontSize: '0.78rem',
                            color: 'var(--color-accent)',
                            fontWeight: 600,
                          }}
                        >
                          {rowLetters[seat.rowIndex]}{seat.columnIndex + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-2">
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio unitario</div>
                    <div style={{ color: 'var(--color-text-primary)', fontWeight: 500, marginTop: '0.3rem', fontSize: '0.9rem' }}>
                      ${Number(reservation.priceAtPurchase).toLocaleString('es-AR')}
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-2">
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div>
                    <div style={{ color: 'var(--color-accent)', fontWeight: 700, marginTop: '0.3rem', fontSize: '1.1rem' }}>
                      ${Number(reservation.totalAmount).toLocaleString('es-AR')}
                    </div>
                  </div>
                </div>

                {reservation.status === ReservationStatus.CONFIRMED && (
                  <div className="mt-3">
                    <button
                      className="btn btn-sm"
                      onClick={() => handleCancelRequest(reservation.id)}
                      disabled={cancellingId === reservation.id}
                      style={{
                        color: 'var(--color-danger)',
                        background: 'rgba(231,76,60,0.1)',
                        border: '1px solid rgba(231,76,60,0.3)',
                        borderRadius: '6px',
                      }}
                    >
                      <i className="bi bi-x-circle me-1"></i>Cancelar reserva
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        show={showConfirm}
        title="Cancelar reserva"
        message="¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer."
        confirmText="Sí, cancelar"
        cancelText="Mantener reserva"
        onConfirm={() => void handleCancelConfirm()}
        onCancel={() => { setShowConfirm(false); setSelectedId(null); }}
        variant="danger"
        isLoading={isCancelling}
      />
    </div>
  );
};

export default MyReservationsPage;