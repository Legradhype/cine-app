import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email!: string;

  @ApiProperty({ example: 'MiPassword123!' })
  @IsString({ message: 'La contraseña debe ser texto.' })
  @MinLength(1, { message: 'La contraseña es requerida.' })
  password!: string;
}
