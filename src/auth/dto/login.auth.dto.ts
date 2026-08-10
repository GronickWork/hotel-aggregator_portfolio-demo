import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ description: 'Email', example: 'user@yandex.ru' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Пароль', example: 'password', format: 'password' })
  @IsNotEmpty()
  password!: string;
}
