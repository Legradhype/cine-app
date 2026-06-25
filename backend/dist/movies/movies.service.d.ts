import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieGenre } from './enums/movie-genre.enum';
export declare class MoviesService {
    private readonly moviesRepository;
    constructor(moviesRepository: Repository<Movie>);
    create(createMovieDto: CreateMovieDto): Promise<Movie>;
    findAll(title?: string, genre?: MovieGenre): Promise<Movie[]>;
    findOne(id: number): Promise<Movie>;
    update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie>;
    updatePoster(id: number, posterUrl: string): Promise<Movie>;
    remove(id: number): Promise<void>;
}
