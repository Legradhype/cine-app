import { Movie } from '../../movies/entities/movie.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { ShowtimeStatus } from '../enums/showtime-status.enum';
export declare class Showtime {
    id: number;
    movie: Movie;
    movieId: number;
    room: Room;
    roomId: number;
    startTime: Date;
    endTime: Date;
    price: number;
    status: ShowtimeStatus;
    createdAt: Date;
    updatedAt: Date;
    reservations: Reservation[];
}
