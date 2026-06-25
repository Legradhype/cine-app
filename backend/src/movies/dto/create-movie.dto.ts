import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateMovieDto {
  @ApiProperty({ example: 'El Señor de los Anillos', description: 'Título de la película' })
  @IsString({ message: 'El título debe ser texto.' })
  @Length(1, 255, { message: 'El título debe tener entre 1 y 255 caracteres.' })
  title!: string;

  @ApiProperty({ description: 'Sinopsis de la película' })
  @IsString({ message: 'La sinopsis debe ser texto.' })
  @Length(1, 5000, { message: 'La sinopsis debe tener entre 1 y 5000 caracteres.' })
  synopsis!: string;

  @ApiProperty({ enum: MovieGenre, description: 'Género de la película' })
  @IsEnum(MovieGenre, { message: 'El género seleccionado no es válido.' })
  genre!: MovieGenre;

  @ApiProperty({ example: 120, description: 'Duración en minutos' })
  @IsInt({ message: 'La duración debe ser un número entero.' })
  @Min(1, { message: 'La duración mínima es 1 minuto.' })
  @Max(600, { message: 'La duración máxima es 600 minutos.' })
  durationMinutes!: number;

  @ApiProperty({ enum: RatingClassification, description: 'Clasificación de la película' })
  @IsEnum(RatingClassification, { message: 'La clasificación seleccionada no es válida.' })
  ratingClassification!: RatingClassification;

  @ApiPropertyOptional({ description: 'URL del poster (se establece al subir imagen)' })
  @IsOptional()
  @IsString()
  posterUrl?: string;
}
