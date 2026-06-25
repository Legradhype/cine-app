import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtime.entity';
export declare class ShowtimesController {
    private readonly showtimesService;
    constructor(showtimesService: ShowtimesService);
    create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime>;
    findAll(): Promise<Showtime[]>;
    findOne(id: number): Promise<Showtime>;
    update(id: number, updateShowtimeDto: UpdateShowtimeDto): Promise<Showtime>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
