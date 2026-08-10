import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SearchUserParams {
  @IsOptional()
  @ApiProperty({ description: 'Limit', example: 10 })
  limit?: number;

  @IsOptional()
  @ApiProperty({ description: 'Offset', example: 0 })
  offset?: number;

  @IsOptional()
  @ApiProperty({ description: 'Email', example: 'helga@yandex.ru', required: false })
  email?: string;

  @IsOptional()
  @ApiProperty({ description: 'Имя', example: 'Helga', required: false })
  name?: string;

  @IsOptional()
  @ApiProperty({ description: 'Телефон', example: '9151234873', required: false })
  contactPhone?: string;
}
