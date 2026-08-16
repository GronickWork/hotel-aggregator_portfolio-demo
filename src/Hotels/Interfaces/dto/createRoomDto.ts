import { ApiProperty } from '@nestjs/swagger';
import type { typeId } from '../../../Users/Interfaces/param-id';

export class createRoomDto {
  @ApiProperty({ description: 'Id отеля', example: '698ef61ee3768e4538208a85' })
  hotel?: typeId;

  @ApiProperty({
    description: 'Описание номера',
    example: 'Двухместный номер Business',
  })
  description?: string;
}
