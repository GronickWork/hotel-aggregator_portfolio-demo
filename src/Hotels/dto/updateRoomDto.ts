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

  hotelId?: string;

  @IsOptional()
  images?: string[];

  isEnabled?: boolean;
  updatedAt?: Date;
}
