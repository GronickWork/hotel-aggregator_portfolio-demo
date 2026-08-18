import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class updateRoomDto {
  @IsOptional()
  @ApiProperty({
    description: 'Описание номера',
    example: 'Как-то меняем описание',
    required: false,
  })
  @IsString()
  description?: string;

  //@ApiProperty({ description: 'Id номера', example: '698ef61ee3768e4538208a85' })
  hotelId?: string;

  //images?: string[];

  isEnabled?: boolean;
  updatedAt?: Date;
}
