import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { User } from '../users/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { ReservationSeat } from './entities/reservation-seat.entity';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(createReservationDto: CreateReservationDto, user: User): Promise<Reservation>;
    findMyReservations(user: User): Promise<Reservation[]>;
    getOccupiedSeats(showtimeId: number): Promise<ReservationSeat[]>;
    findAll(): Promise<Reservation[]>;
    findOne(id: number, user: User): Promise<Reservation>;
    cancel(id: number, user: User): Promise<Reservation>;
}
