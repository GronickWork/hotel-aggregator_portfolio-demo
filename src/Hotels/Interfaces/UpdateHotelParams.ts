import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateHotelParams {
  @IsOptional()
  @ApiProperty({ description: 'Название отеля', example: 'Премьер2' })
  title!: string;

  @IsOptional()
  @ApiProperty({
    description: 'Описание отеля',
    example: 'Нижний Новгород, Ильинская улица, 3, 750м до центра',
  })
  description!: string;
}
