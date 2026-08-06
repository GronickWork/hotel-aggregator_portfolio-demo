import { ApiProperty } from '@nestjs/swagger';

export class SearchUserParams {
  @ApiProperty({ description: 'Limit', example: 10 })
  limit!: number;

  @ApiProperty({ description: 'Offset', example: 0 })
  offset!: number;

  @ApiProperty({ description: 'Email', example: 'helga@yandex.ru' })
  email!: string;

  @ApiProperty({ description: 'Имя', example: 'Helga' })
  name!: string;

  @ApiProperty({ description: 'Телефон', example: '9151234873' })
  contactPhone!: string;
}
