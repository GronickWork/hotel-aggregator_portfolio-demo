import { ApiProperty } from '@nestjs/swagger';

export class updateRoomDto {
  @ApiProperty({ description: 'Описание номера', example: 'Двухместный номер Business' })
  description?: string;

  @ApiProperty({ description: 'Id отеля', example: '698ef61ee3768e4538208a85' })
  hotelId?: string;

  images?: string[];

  isEnabled?: boolean;
  updatedAt?: Date;
}
