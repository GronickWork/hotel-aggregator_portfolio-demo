import { ApiProperty } from '@nestjs/swagger';

export class createHotelDto {
  @ApiProperty({ description: 'Название отеля', example: 'Ока' })
  title!: string;

  @ApiProperty({
    description: 'Описание',
    example: 'Нижний Новгород, Ильинская улица, 3, 750м до центра',
  })
  description!: string;
}
