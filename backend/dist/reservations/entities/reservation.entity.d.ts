import { User } from '../../users/entities/user.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { ReservationSeat } from './reservation-seat.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';
export declare class Reservation {
    id: number;
    user: User;
    userId: number;
    showtime: Showtime;
    showtimeId: number;
    priceAtPurchase: number;
    totalAmount: number;
    status: ReservationStatus;
    createdAt: Date;
    updatedAt: Date;
    seats: ReservationSeat[];
}
