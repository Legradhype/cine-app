import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ShowtimeStatus } from '../enums/showtime-status.enum';

export class CreateShowtimeDto {
  @ApiProperty({ example: 1, description: 'ID de la película' })
  @IsInt({ message: 'El ID de la película debe ser un número entero.' })
  @Min(1, { message: 'El ID de la película no es válido.' })
  movieId!: number;

  @ApiProperty({ example: 2, description: 'ID de la sala' })
  @IsInt({ message: 'El ID de la sala debe ser un número entero.' })
  @Min(1, { message: 'El ID de la sala no es válido.' })
  roomId!: number;

  @ApiProperty({ example: '2026-06-25T20:00:00.000Z', description: 'Fecha y hora de inicio' })
  @IsDateString({}, { message: 'La fecha de inicio no es válida.' })
  startTime!: string;

  @ApiProperty({ example: '2026-06-25T22:00:00.000Z', description: 'Fecha y hora de fin' })
  @IsDateString({}, { message: 'La fecha de fin no es válida.' })
  endTime!: string;

  @ApiProperty({ example: 35, description: 'Precio de la entrada' })
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0, { message: 'El precio no puede ser negativo.' })
  price!: number;

  @ApiPropertyOptional({ enum: ShowtimeStatus, default: ShowtimeStatus.SCHEDULED })
  @IsOptional()
  @IsEnum(ShowtimeStatus, { message: 'El estado de la función no es válido.' })
  status?: ShowtimeStatus;
}