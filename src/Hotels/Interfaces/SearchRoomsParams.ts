import { ApiProperty } from '@nestjs/swagger';
import { typeId } from '../../Users/Interfaces/param-id';

export class SearchRoomsParams {
  @ApiProperty({ description: 'limit', example: 10 })
  limit?: number;

  @ApiProperty({ description: 'Offset', example: 0 })
  offset?: number;

  @ApiProperty({ description: 'Offset', example: 0 })
  hotel?: typeId | string;

  isEnabled?: boolean | undefined;
}
