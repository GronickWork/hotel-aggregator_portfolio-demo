import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegistrAuthDto {
  @IsEmail()
  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  email!: string; //! обозначает Я знаю, что ты хочешь гарантий, но я обещаю: NestJS сам положит туда данные из JSON, так что не ругайся

  @MinLength(6)
  @ApiProperty({ description: 'Пароль', example: 'Strong123!', format: 'password' })
  password!: string;

  @IsString()
  @ApiProperty({ description: 'Имя', example: 'Иван Иванов' })
  name!: string;

  @IsString()
  @ApiProperty({ description: 'Телефон', example: '+79990000000' })
  contactPhone!: string;
}
