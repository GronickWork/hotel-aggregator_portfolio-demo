/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SupportRequest } from '../schemas/supportRequest.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SendMessageDto } from '../Interfaces/dto/SendMessageDto';
import { ReplyMessageClient } from '../Interfaces/ReplyMessageClient';
import moment from 'moment';
import 'moment/locale/ru';
import { GetChatListParams } from '../Interfaces/GetChatListParams';
import { UsersService } from '../../Users/users.service';
import { ReplyMessageManager } from '../Interfaces/ReplyMessageManager';
import { ReplySendMessages } from '../Interfaces/ReplySendMessages';
import { typeId } from 'src/Users/Interfaces/param-id';
import { CreateMessageDto } from '../Interfaces/dto/CreateMessageDto';
import { SupportRequestClientService } from '../support-request-client/support-request-client.service';
import { MarkMessagesAsReadDto } from '../Interfaces/dto/MarkMessagesAsReadDto';
import { SupportRequestEmployeeService } from '../support-request-employee/support-request-employee.servise';
import { GetUnreadDto } from '../Interfaces/dto/GetUnreadDto';
import { ISupportRequestService } from '../Interfaces/ISupportRequestService';
import { Message } from '../schemas/message.schema';
import { eventEmitter, SupportMessageEvent } from './events';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name) private SupRequest: Model<SupportRequestService>,
    private readonly SRCService: SupportRequestClientService,
    private readonly userSrv: UsersService,
    private readonly SREService: SupportRequestEmployeeService,
  ) {}
  /*Метод проверен */
  async findSupportRequests(
    params: GetChatListParams,
    userid?: string,
  ): Promise<ReplyMessageClient[] | ReplyMessageManager[] | undefined> {
    if (userid) {
      const listCli: ReplyMessageClient[] = [];
      const findReq = await this.SupRequest.find({
        user: userid,
        isActive: params.isActive,
      })
        .select('-__v')
        .exec();
      findReq.forEach((item) => {
        const outItem = this.SRCService.outputAnswerOnce(
          item as unknown as SupportRequest,
          'on',
        );
        listCli.push(outItem);
      });
      return listCli;
    }

    const listMan: ReplyMessageManager[] = [];
    const findReq = await this.SupRequest.find({
      isActive: params.isActive,
    })
      .select('_id user createdAt isActive')
      .exec();
    for (let i = 0; i < findReq.length; i++) {
      const item = findReq[i];
      const supportItem = item as unknown as SupportRequest;
      const dataClient = await this.userSrv.findById(supportItem.user);
      const outEl: ReplyMessageManager = {
        id: item._id.toString(),
        isActive: supportItem.isActive,
        createdAt: moment(supportItem.createdAt).format('D MMMM YYYY'),
        hasNewMessages: true,
        client: {
          id: dataClient?.id.toString(),
          name: dataClient?.name,
          email: dataClient?.email,
          contactPhone: dataClient?.contactPhone,
        },
      };
      listMan.push(outEl);
    }
    return listMan;
  }
  /*Метод проверен */
  async sendMessage(data: SendMessageDto): Promise<ReplySendMessages> {
    const newdataMess: CreateMessageDto = { author: data.author, text: data.text };
    try {
      const newMess = await this.SRCService.createMessage(newdataMess);
      const uppdateRequest: SupportRequest | null =
        await this.SupRequest.findByIdAndUpdate(
          data.supportRequest,
          {
            $push: { messages: newMess.id }, // добавляем в массив messages id нового сообщения
          },
          { new: true },
        );
      if (!uppdateRequest)
        throw new HttpException(
          `Обращения с id: ${data.supportRequest} не найдено.(sendMess)`,
          404,
        );
      return await this.SRCService.getMessage(uppdateRequest.user);
    } catch (err) {
      throw err;
    }
  }
  /*Метод проверен */
  async getMessages(messId: typeId | string): Promise<ReplySendMessages[]> {
    const outMess: ReplySendMessages[] = [];
    const sReq: SupportRequest | null = await this.findById(messId);
    if (!sReq)
      throw new HttpException(`Обращения с id: ${messId} не найдено.(getMess)`, 404);
    for (let i = 0; i < sReq.messages.length; i++) {
      const item = sReq.messages[i];
      const message = await this.SRCService.getMessage(item);
      outMess.push(message);
    }
    return outMess;
  }
  /*Метод проверен */ // метод нужен для SupportRequestGuard.
  async findById(id: string | typeId): Promise<SupportRequest | null> {
    return await this.SupRequest.findById(id);
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    eventEmitter.on('new-message', handler);
    return () => {
      eventEmitter.off('new-message', handler);
    };
  }

  emitNewMessage(requestId: string, message: any) {
    eventEmitter.emit('new-message', new SupportMessageEvent(requestId, message));
  }

  async prepearingStampDate(data: MarkMessagesAsReadDto) {
    const user = await this.userSrv.findById(data.user);
    return user?.role != 'client'
      ? await this.SRCService.markMessagesAsRead(data)
      : await this.SREService.markMessagesAsRead(data);
  }

  async prepearingCountMess(data: GetUnreadDto) {
    const user = await this.userSrv.findById(data.userId);
    return user?.role != 'client'
      ? await this.SRCService.getUnreadCount(data)
      : await this.SREService.getUnreadCount(data);
  }
}
