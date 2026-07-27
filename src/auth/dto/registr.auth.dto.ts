import { ApiProperty } from '@nestjs/swagger';

export class RegistrAuthDto {
  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  email!: string; //! обозначает Я знаю, что ты хочешь гарантий, но я обещаю: NestJS сам положит туда данные из JSON, так что не ругайся

  @ApiProperty({ description: 'Пароль', example: 'Strong123!', format: 'password' })
  password!: string;

  @ApiProperty({ description: 'Имя', example: 'Иван Иванов' })
  dname!: string;

  @ApiProperty({ description: 'Телефон', example: '+79990000000' })
  contactPhone!: string;
}
