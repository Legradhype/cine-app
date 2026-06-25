import { MovieGenre } from '../enums/movie-genre.enum';
import { RatingClassification } from '../enums/rating-classification.enum';
import { Showtime } from '../../showtimes/entities/showtime.entity';
export declare class Movie {
    id: number;
    title: string;
    synopsis: string;
    genre: MovieGenre;
    durationMinutes: number;
    ratingClassification: RatingClassification;
    posterUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    showtimes: Showtime[];
}
