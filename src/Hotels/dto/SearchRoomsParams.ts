import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
//import { typeId } from '../../Users/Interfaces/param-id';

export class SearchRoomsParams {
  @ApiProperty({ description: 'limit', example: 10, required: false })
  @IsOptional()
  readonly limit?: number;

  @ApiProperty({ description: 'Offset', example: 0, required: false })
  @IsOptional()
  readonly offset?: number;

  @ApiProperty({
    description: 'Id отеля',
    example: '698ef61ee3768e4538208a85',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly hotel?: string;

  isEnabled?: true;
}
