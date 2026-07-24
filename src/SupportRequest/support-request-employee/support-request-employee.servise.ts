import { Injectable } from '@nestjs/common';
import { MarkMessagesAsReadDto } from '../Interfaces/dto/MarkMessagesAsReadDto';
import { InjectModel } from '@nestjs/mongoose';
import { SupportRequest } from '../schemas/supportRequest.schema';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { SupportRequestClientService } from '../support-request-client/support-request-client.service';
import { GetUnreadDto } from '../Interfaces/dto/GetUnreadDto';
import { typeId } from 'src/Users/Interfaces/param-id';
import { ISupportRequestEmployeeService } from '../Interfaces/ISupportRequestEmployeeService';

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
  constructor(
    @InjectModel(SupportRequest.name) private SREService: Model<SupportRequest>,
    @InjectModel(Message.name) private Message: Model<Message>,
    private readonly SRCService: SupportRequestClientService,
  ) {}

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    return this.SRCService.markMessagesAsRead(params);
  }

  async getUnreadCount(data: GetUnreadDto) {
    return this.SRCService.getUnreadCount(data);
  }

  async closeRequest(supportRequest: typeId): Promise<void> {
    await this.SREService.findByIdAndUpdate(supportRequest, { isActive: false });
  }
}
