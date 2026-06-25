import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email!: string;

  @ApiProperty({ example: 'MiPassword123!' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Length(6, 100, { message: 'La contraseña debe tener entre 6 y 100 caracteres.' })
  password!: string;

  @ApiProperty({ enum: UserRole, required: false, default: UserRole.CLIENT })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser ADMIN o CLIENT.' })
  role?: UserRole;
}
