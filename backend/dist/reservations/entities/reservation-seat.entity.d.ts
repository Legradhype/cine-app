import { Reservation } from './reservation.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';
export declare class ReservationSeat {
    id: number;
    reservation: Reservation;
    reservationId: number;
    showtime: Showtime;
    showtimeId: number;
    rowIndex: number;
    columnIndex: number;
    createdAt: Date;
    updatedAt: Date;
}
