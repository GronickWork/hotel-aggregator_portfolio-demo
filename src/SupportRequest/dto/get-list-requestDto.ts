import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetListRequestDto {
  @ApiProperty({ description: 'limit', example: 10, required: false })
  @IsOptional()
  readonly limit?: number;

  @ApiProperty({ description: 'offset', example: 0, required: false })
  @IsOptional()
  readonly offset?: number;

  @ApiProperty({ description: 'isActive', example: true, required: false })
  @IsOptional()
  isActive?: boolean;
}
