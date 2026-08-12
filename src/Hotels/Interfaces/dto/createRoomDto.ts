import { ApiProperty } from '@nestjs/swagger';
import type { typeId } from '../../../Users/Interfaces/param-id';

export class createRoomDto {
  @ApiProperty({ description: 'Id отеля', example: '698ef61ee3768e4538208a85' })
  hotel?: typeId;

  @ApiProperty({
    description: 'Описание отеля',
    example: 'Нижний Новгород, Ильинская улица, 3, 750м до центра',
  })
  description?: string;

  @ApiProperty({
    description: 'Список URL изображений',
    example: ['himgStorage/prime1.jpeg, imgStorage/prime2.jpeg'],
    type: [String],
    isArray: true,
  })
  images?: string[];
}
