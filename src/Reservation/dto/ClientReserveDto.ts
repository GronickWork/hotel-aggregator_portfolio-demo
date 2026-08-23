import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClientReserveDto {
  @ApiProperty({ description: 'Id комнаты отеля', example: '6a834fcf99ae30f43e346033' })
  @IsString()
  hotelRoom!: string;

  @ApiProperty({
    description: 'Дата заезда в формате ГГГГ-ММ-ДД',
    example: '2026-09-01',
  })
  @IsString()
  dateStart!: string;

  @ApiProperty({
    description: 'Дата выезда в формате ГГГГ-ММ-ДД',
    example: '2026-09-05',
  })
  @IsString()
  dateEnd!: string;
}
