import { ApiProperty } from '@nestjs/swagger';
import { typeId } from '../../Users/Interfaces/param-id';
import { IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    type: String,
    description: 'Сообщение в чат',
    example: 'Какое-то сообщение',
  })
  @IsString()
  text!: string;

  author!: typeId;
  supportRequest!: typeId | string;
}
