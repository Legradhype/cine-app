import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  Max,
} from 'class-validator';
import { MovieGenre } from '../enums/movie-genre.enum';
import { RatingClassification } from '../enums/rating-classification.enum';

export class UpdateMovieDto {
  @ApiPropertyOptional({ example: 'El Señor de los Anillos' })
  @IsOptional()
  @IsString({ message: 'El título debe ser texto.' })
  @Length(1, 255, { message: 'El título debe tener entre 1 y 255 caracteres.' })
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La sinopsis debe ser texto.' })
  @Length(1, 5000)
  synopsis?: string;

  @ApiPropertyOptional({ enum: MovieGenre })
  @IsOptional()
  @IsEnum(MovieGenre, { message: 'El género seleccionado no es válido.' })
  genre?: MovieGenre;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsInt({ message: 'La duración debe ser un número entero.' })
  @Min(1)
  @Max(600)
  durationMinutes?: number;

  @ApiPropertyOptional({ enum: RatingClassification })
  @IsOptional()
  @IsEnum(RatingClassification, { message: 'La clasificación seleccionada no es válida.' })
  ratingClassification?: RatingClassification;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  posterUrl?: string;
}
