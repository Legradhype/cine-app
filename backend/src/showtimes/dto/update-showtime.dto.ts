import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ShowtimeStatus } from '../enums/showtime-status.enum';

export class UpdateShowtimeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: 'El ID de la película debe ser un número entero.' })
  movieId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: 'El ID de la sala debe ser un número entero.' })
  roomId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio no es válida.' })
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin no es válida.' })
  endTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ enum: ShowtimeStatus })
  @IsOptional()
  @IsEnum(ShowtimeStatus, { message: 'El estado de la función no es válido.' })
  status?: ShowtimeStatus;
}