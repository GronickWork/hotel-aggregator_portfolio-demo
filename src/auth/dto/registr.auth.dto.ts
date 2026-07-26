import { ApiProperty } from '@nestjs/swagger';

export class RegistrAuthDto {
  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  email!: string;

  @ApiProperty({ description: 'Пароль', example: 'Strong123!', format: 'password' })
  password!: string;

  @ApiProperty({ description: 'Имя', example: 'Иван Иванов' })
  dname!: string;

  @ApiProperty({ description: 'Телефон', example: '+79990000000' })
  contactPhone!: string;
}
