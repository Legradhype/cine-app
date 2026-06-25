import { ShowtimeStatus } from '../enums/showtime-status.enum';
export declare class UpdateShowtimeDto {
    movieId?: number;
    roomId?: number;
    startTime?: string;
    endTime?: string;
    price?: number;
    status?: ShowtimeStatus;
}
