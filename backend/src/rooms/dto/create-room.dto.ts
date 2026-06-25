import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Sala 1', description: 'Nombre único de la sala' })
  @IsString({ message: 'El nombre debe ser texto.' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres.' })
  name!: string;

  @ApiProperty({ example: 8, description: 'Número de filas' })
  @IsInt({ message: 'La cantidad de filas debe ser un número entero.' })
  @Min(1, { message: 'La sala debe tener al menos 1 fila.' })
  @Max(30, { message: 'La sala puede tener como máximo 30 filas.' })
  totalRows!: number;

  @ApiProperty({ example: 10, description: 'Número de columnas' })
  @IsInt({ message: 'La cantidad de columnas debe ser un número entero.' })
  @Min(1, { message: 'La sala debe tener al menos 1 columna.' })
  @Max(30, { message: 'La sala puede tener como máximo 30 columnas.' })
  totalColumns!: number;
}
