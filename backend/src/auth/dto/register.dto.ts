import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@email.com', description: 'Correo electrónico' })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email!: string;

  @ApiProperty({ example: 'MiPassword123!', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsString({ message: 'La contraseña debe ser texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Length(6, 100, { message: 'La contraseña debe tener entre 6 y 100 caracteres.' })
  password!: string;
}
