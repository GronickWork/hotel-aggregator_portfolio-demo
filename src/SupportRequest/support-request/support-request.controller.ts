/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { SendMessageDto } from '../Interfaces/dto/SendMessageDto';
import { SupportRequestService } from './support-request.service';
import { AuthUserGuard } from '../../guards/auth.guard';
import type { GetChatListParams } from '../Interfaces/GetChatListParams';
import type { ReplyMessageClient } from '../Interfaces/ReplyMessageClient';
import { ReplyMessageManager } from '../Interfaces/ReplyMessageManager';
import { SupportRequestGuard } from '../../guards/support-request.guard';
import { ReplySendMessages } from '../Interfaces/ReplySendMessages';
import { MarkMessagesAsReadDto } from '../Interfaces/dto/MarkMessagesAsReadDto';
import { typeId } from '../../Users/Interfaces/param-id';
import { GetUnreadDto } from '../Interfaces/dto/GetUnreadDto';
@Controller('/api')
export class SupportRequestController {
  constructor(private readonly supReqSrv: SupportRequestService) {}

  @Get('/client/support-requests/') //Метод проверен
  @UseGuards(AuthUserGuard)
  async getListClient(
    @Req() req,
    @Query() body: GetChatListParams,
  ): Promise<ReplyMessageClient[] | ReplyMessageManager[] | undefined> {
    const sessId: string = req.session.userId;
    return await this.supReqSrv.findSupportRequests(body, sessId);
  }

  @Get('/manager/support-requests/') //Метод проверен
  @UseGuards(AuthUserGuard)
  async getListManager(@Query() params: GetChatListParams) {
    return await this.supReqSrv.findSupportRequests(params, '');
  }

  @Get('/common/support-requests/:id/messages') //Метод проверен
  @UseGuards(AuthUserGuard, SupportRequestGuard)
  async getHistoryMessage(@Param('id') id: string): Promise<ReplySendMessages[]> {
    return await this.supReqSrv.getMessages(id);
  }

  @Post('/common/support-requests/:id/messages') //Метод проверен
  @UseGuards(AuthUserGuard, SupportRequestGuard)
  async postMessageRequest(
    @Param('id') paramId: string,
    @Body() data: SendMessageDto,
    @Req() req,
  ): Promise<ReplySendMessages> {
    const postMReq: SendMessageDto = {
      author: req.session.userId,
      supportRequest: paramId,
      text: data.text,
    };
    const newMess = await this.supReqSrv.sendMessage(postMReq);
    this.supReqSrv.emitNewMessage(postMReq.supportRequest as string, newMess);
    return newMess;
  }

  @Post('/common/support-requests/:id/messages/read')
  @UseGuards(AuthUserGuard, SupportRequestGuard)
  async markDateAsRead(@Param('id') supRId: string, @Req() req) {
    const sessId = req.session.userId;
    const readData: MarkMessagesAsReadDto = {
      user: sessId,
      supportRequest: supRId as typeId,
      createdBefore: new Date(),
    };
    return await this.supReqSrv.prepearingStampDate(readData);
  }

  @Get('/common/support-requests/:id/messages/read')
  @UseGuards(AuthUserGuard, SupportRequestGuard)
  async getUnreadCount(@Param('id') supRId: string, @Req() req) {
    const sessId = req.session.userId;
    const data: GetUnreadDto = {
      supRId: supRId as typeId,
      userId: sessId,
    };
    return await this.supReqSrv.prepearingCountMess(data);
  }
}
