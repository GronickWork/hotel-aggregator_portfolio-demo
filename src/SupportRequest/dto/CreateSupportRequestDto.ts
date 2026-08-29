import { ApiProperty } from '@nestjs/swagger';
//import { typeId } from '../../Users/Interfaces/param-id';
import { IsString } from 'class-validator';

export class CreateSupportRequestDto {
  user!: string;

  @ApiProperty({
    description: 'Содержание обращения в техподдержку',
    example: 'Например, что-то не срабатывает.',
  })
  @IsString()
  text!: string;
}
