import React from 'react';
import { Room, ReservationSeat, SeatPosition } from '../types';

interface SeatMapProps {
  room: Room;
  occupiedSeats: ReservationSeat[];
  selectedSeats: SeatPosition[];
  onSeatToggle: (seat: SeatPosition) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({
  room,
  occupiedSeats,
  selectedSeats,
  onSeatToggle,
}) => {
  const isOccupied = (rowIndex: number, columnIndex: number): boolean => {
    return occupiedSeats.some(
      (s) => s.rowIndex === rowIndex && s.columnIndex === columnIndex,
    );
  };

  const isSelected = (rowIndex: number, columnIndex: number): boolean => {
    return selectedSeats.some(
      (s) => s.rowIndex === rowIndex && s.columnIndex === columnIndex,
    );
  };

  const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className="seatmap-container">
      <div className="seatmap-screen"></div>

      <div className="seatmap-grid">
        {Array.from({ length: room.totalRows }, (_, rowIndex) => (
          <div key={rowIndex} className="seatmap-row">
            <span
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.75rem',
                fontWeight: '600',
                width: '20px',
                textAlign: 'right',
                marginRight: '4px',
                flexShrink: 0,
              }}
            >
              {rowLetters[rowIndex] ?? rowIndex + 1}
            </span>
            {Array.from({ length: room.totalColumns }, (_, colIndex) => {
              const occupied = isOccupied(rowIndex, colIndex);
              const selected = isSelected(rowIndex, colIndex);

              let seatClass = 'seat seat-available';
              if (occupied) seatClass = 'seat seat-occupied';
              else if (selected) seatClass = 'seat seat-selected';

              return (
                <button
                  key={colIndex}
                  className={seatClass}
                  disabled={occupied}
                  onClick={() => {
                    if (!occupied) {
                      onSeatToggle({ rowIndex, columnIndex: colIndex });
                    }
                  }}
                  title={`Fila ${rowLetters[rowIndex] ?? rowIndex + 1}, Asiento ${colIndex + 1}`}
                  aria-label={`Asiento fila ${rowLetters[rowIndex] ?? rowIndex + 1} columna ${colIndex + 1}${
                    occupied ? ' - Ocupado' : selected ? ' - Seleccionado' : ' - Disponible'
                  }`}
                >
                  {colIndex + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="seatmap-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'rgba(46,204,113,0.15)', border: '1px solid rgba(46,204,113,0.4)' }}></div>
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'linear-gradient(135deg, var(--color-accent), #c73652)', border: '1px solid var(--color-accent)' }}></div>
          <span>Seleccionado</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'rgba(231,76,60,0.2)', border: '1px solid rgba(231,76,60,0.3)', opacity: 0.6 }}></div>
          <span>Ocupado</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
