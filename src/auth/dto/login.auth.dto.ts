import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  email!: string;

  @ApiProperty({ description: 'Пароль', example: 'Strong123!', format: 'password' })
  password!: string;
}
