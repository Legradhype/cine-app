import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

export class SeatDto {
  @ApiProperty({ example: 0, description: 'Índice de fila (base 0)' })
  @IsInt({ message: 'El índice de fila debe ser un número entero.' })
  @Min(0, { message: 'El índice de fila no puede ser negativo.' })
  rowIndex!: number;

  @ApiProperty({ example: 3, description: 'Índice de columna (base 0)' })
  @IsInt({ message: 'El índice de columna debe ser un número entero.' })
  @Min(0, { message: 'El índice de columna no puede ser negativo.' })
  columnIndex!: number;
}

export class CreateReservationDto {
  @ApiProperty({ example: 1, description: 'ID de la función' })
  @IsInt({ message: 'El ID de la función debe ser un número entero.' })
  showtimeId!: number;

  @ApiProperty({ type: [SeatDto], description: 'Asientos a reservar' })
  @IsArray({ message: 'Los asientos deben ser un arreglo.' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un asiento.' })
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats!: SeatDto[];
}