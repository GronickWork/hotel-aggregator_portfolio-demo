/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { ISupportRequestClientService } from '../Interfaces/ISupportRequestClientService';
import { typeId } from 'src/Users/Interfaces/param-id';
import { CreateSupportRequestDto } from '../Interfaces/dto/CreateSupportRequestDto';
import { ReplyMessageClient } from '../Interfaces/ReplyMessageClient';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '../schemas/message.schema';
import { CreateMessageDto } from '../Interfaces/dto/CreateMessageDto';
import { SupportRequest } from '../schemas/supportRequest.schema';
import { ReplySendMessages } from '../Interfaces/ReplySendMessages';
import { UsersService } from '../../Users/users.service';
import moment from 'moment';
import { MarkMessagesAsReadDto } from '../Interfaces/dto/MarkMessagesAsReadDto';
import { GetUnreadDto } from '../Interfaces/dto/GetUnreadDto';

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService {
  constructor(
    @InjectModel(SupportRequest.name) private SRCService: Model<SupportRequest>,
    @InjectModel(Message.name) private Message: Model<Message>,
    private readonly userSrv: UsersService,
  ) {}
  async createSupportRequest(data: CreateSupportRequestDto): Promise<ReplyMessageClient> {
    if (!data) {
      console.log('From SRCService method createSupportRequest data is empty!');
      throw new HttpException('data is empty', 404);
    }
    try {
      const messageCreationData: CreateMessageDto = {
        author: data.user,
        text: data.text,
      };
      const newMess = await this.createMessage(messageCreationData);
      const newDataTicket = { user: data.user, messages: [newMess.id] };
      const newTicket = new this.SRCService(newDataTicket);
      await newTicket.save();
      return this.outputAnswerOnce(newTicket as unknown as SupportRequest, 'on');
    } catch (err) {
      throw err;
    }
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const request = await this.SRCService.findById(params.supportRequest);
    if (!request)
      throw new HttpException(
        `Обращения с id: ${params.supportRequest as string} не найдено.`,
        400,
      );
    try {
      for (let i = 0; i < request?.messages.length; i++) {
        const item = request.messages[i];
        const message = await this.Message.findById(item);
        if (message?.author != params.user && !message?.readAt) {
          await this.Message.findByIdAndUpdate(item, { readAt: params.createdBefore });
        }
      }
      return { success: true };
    } catch (err) {
      throw err;
    }
  }

  async getUnreadCount(data: GetUnreadDto): Promise<number> {
    const allMess = await this.SRCService.findById(data.supRId);
    if (!allMess || !allMess.messages)
      throw new HttpException('В данном запросе нет сообщений', 400);
    return this.Message.countDocuments({
      _id: { $in: allMess.messages },
      author: { $ne: data.userId },
      readAt: null,
    });
  }

  async createMessage(data: CreateMessageDto): Promise<Message> {
    const newMess = new this.Message(data);
    await newMess.save();
    return newMess;
  }

  async getMessage(messId: typeId | string): Promise<ReplySendMessages> {
    const message = await this.Message.findById(messId).select(
      'id sentAt text readAt author',
    );
    if (message) {
      const user = await this.userSrv.findById(message.author);
      const getMess: ReplySendMessages = {
        id: message.id,
        createdAt: moment(message.sentAt).format('D MMMM YYYY'),
        text: message.text,
        readAt: message.readAt ? moment(message.readAt).format('D MMMM YYYY') : '',
        author: {
          id: user?.id.toString(),
          name: user?.name,
        },
      };
      return getMess;
    } else {
      throw new HttpException('Ни одного сообщения не найдено!', 404);
    }
  }

  outputAnswerOnce(data: SupportRequest, flag: string): ReplyMessageClient {
    const dateString = moment(data.createdAt).format('D MMMM YYYY');
    const hasNewMess = flag === 'on' ? true : false;
    const outData = {
      id: data.id,
      createdAt: dateString,
      isActive: data.isActive,
      hasNewMessages: hasNewMess,
    };
    return outData;
  }
}
