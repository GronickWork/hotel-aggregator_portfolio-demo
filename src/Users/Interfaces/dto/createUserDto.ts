import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty({ description: 'Имя', example: 'Иван Иванов' })
  name!: string;

  @ApiProperty({ description: 'пароль', example: 'Hash password' })
  passwordHash!: string;

  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  email!: string;

  @ApiProperty({ description: 'Телефон', example: '+79990000000' })
  contactPhone!: string;

  @ApiProperty({ description: 'Статус', example: 'client' })
  role!: 'client' | 'admin' | 'manager';

  @ApiProperty({ description: 'Кто создал', example: 'self' })
  whoCreate!: 'self' | 'admin';
}
