import { ApiProperty } from '@nestjs/swagger';
import { typeId } from '../../Users/Interfaces/param-id';

export class SearchRoomsParams {
  @ApiProperty({ description: 'limit', example: 10, required: false })
  limit?: number;

  @ApiProperty({ description: 'Offset', example: 0, required: false })
  offset?: number;

  @ApiProperty({
    description: 'Id отеля',
    example: '698ef61ee3768e4538208a85',
    required: false,
    type: String,
  })
  hotel?: typeId | string;

  isEnabled?: boolean | undefined;
}
