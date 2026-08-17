import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class createRoomDto {
  @ApiProperty({ description: 'Id отеля', example: '698ef61ee3768e4538208a85' })
  @IsString()
  @IsMongoId()
  hotel!: string;

  @ApiProperty({
    description: 'Описание номера',
    example: 'Двухместный номер Business',
  })
  @IsString()
  description!: string;

  @IsOptional()
  images?: string[];
}
