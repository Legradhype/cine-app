import { Showtime } from '../../showtimes/entities/showtime.entity';
export declare class Room {
    id: number;
    name: string;
    totalRows: number;
    totalColumns: number;
    createdAt: Date;
    updatedAt: Date;
    showtimes: Showtime[];
}
