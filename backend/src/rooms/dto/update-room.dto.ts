import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class UpdateRoomDto {
  @ApiPropertyOptional({ example: 'Sala VIP' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto.' })
  @Length(1, 100)
  name?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt({ message: 'La cantidad de filas debe ser un número entero.' })
  @Min(1)
  @Max(30)
  totalRows?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsInt({ message: 'La cantidad de columnas debe ser un número entero.' })
  @Min(1)
  @Max(30)
  totalColumns?: number;
}
