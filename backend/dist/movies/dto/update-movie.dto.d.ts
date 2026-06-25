import { MovieGenre } from '../enums/movie-genre.enum';
import { RatingClassification } from '../enums/rating-classification.enum';
export declare class UpdateMovieDto {
    title?: string;
    synopsis?: string;
    genre?: MovieGenre;
    durationMinutes?: number;
    ratingClassification?: RatingClassification;
    posterUrl?: string;
}
