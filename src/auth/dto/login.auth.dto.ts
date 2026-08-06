import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ description: 'Email', example: 'admin@yandex.ru' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Пароль', example: '25xGnuO', format: 'password' })
  @IsNotEmpty()
  password!: string;
}
