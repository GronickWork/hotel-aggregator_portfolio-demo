import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ description: 'Email', example: 'peter@yandex.ru' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Пароль', example: '12345', format: 'password' })
  @IsNotEmpty()
  password!: string;
}
