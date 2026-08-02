import { ApiProperty } from '@nestjs/swagger';

export class SearchUserParams {
  @ApiProperty({ description: 'Limit', example: 10 })
  limit!: number;

  @ApiProperty({ description: 'Offset', example: 0 })
  offset!: number;

  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  email!: string;

  @ApiProperty({ description: 'Имя', example: 'Иван Иванов' })
  name!: string;

  @ApiProperty({ description: 'Телефон', example: '+79990000000' })
  contactPhone!: string;
}
