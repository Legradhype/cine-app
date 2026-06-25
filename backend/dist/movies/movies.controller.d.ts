import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MovieGenre } from './enums/movie-genre.enum';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    create(createMovieDto: CreateMovieDto): Promise<Movie>;
    findAll(title?: string, genre?: MovieGenre): Promise<Movie[]>;
    findOne(id: number): Promise<Movie>;
    update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie>;
    remove(id: number): Promise<{
        message: string;
    }>;
    uploadPoster(id: number, file: Express.Multer.File): Promise<Movie>;
}
