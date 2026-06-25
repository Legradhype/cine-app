import { DataSource, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationSeat } from './entities/reservation-seat.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { User } from '../users/entities/user.entity';
export declare class ReservationsService {
    private readonly reservationsRepository;
    private readonly reservationSeatsRepository;
    private readonly showtimesService;
    private readonly dataSource;
    constructor(reservationsRepository: Repository<Reservation>, reservationSeatsRepository: Repository<ReservationSeat>, showtimesService: ShowtimesService, dataSource: DataSource);
    create(createReservationDto: CreateReservationDto, user: User): Promise<Reservation>;
    findMyReservations(userId: number): Promise<Reservation[]>;
    findAll(): Promise<Reservation[]>;
    findOne(id: number, userId?: number): Promise<Reservation>;
    cancel(id: number, userId: number): Promise<Reservation>;
    getOccupiedSeats(showtimeId: number): Promise<ReservationSeat[]>;
}
