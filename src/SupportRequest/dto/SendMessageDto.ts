import { ApiProperty } from '@nestjs/swagger';
import { typeId } from '../../Users/Interfaces/param-id';

export class SendMessageDto {
  author!: typeId;
  supportRequest!: typeId | string;

  @ApiProperty({
    description: 'Сообщение в чат',
    example: 'Какое-то сообщение',
    required: false,
  })
  text!: string;
}
