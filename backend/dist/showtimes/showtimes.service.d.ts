import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { MoviesService } from '../movies/movies.service';
import { RoomsService } from '../rooms/rooms.service';
export declare class ShowtimesService {
    private readonly showtimesRepository;
    private readonly moviesService;
    private readonly roomsService;
    constructor(showtimesRepository: Repository<Showtime>, moviesService: MoviesService, roomsService: RoomsService);
    private checkOverlap;
    create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime>;
    findAll(): Promise<Showtime[]>;
    findByMovie(movieId: number): Promise<Showtime[]>;
    findOne(id: number): Promise<Showtime>;
    update(id: number, updateShowtimeDto: UpdateShowtimeDto): Promise<Showtime>;
    remove(id: number): Promise<void>;
    findOneWithRoom(id: number): Promise<Showtime>;
}
