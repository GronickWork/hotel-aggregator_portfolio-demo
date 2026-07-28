import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ description: 'Email', example: 'helga@yandex.ru' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Пароль', example: 'J9QZTqk', format: 'password' })
  @IsNotEmpty()
  password!: string;
}
