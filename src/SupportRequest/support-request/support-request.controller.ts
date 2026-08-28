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
import type { SendMessageDto } from '../dto/SendMessageDto';
import { SupportRequestService } from './support-request.service';
import { AuthJwtGuard } from '../../guards/auth.jwt.guard';
import type { GetChatListParams } from '../Interfaces/GetChatListParams';
import type { ReplyMessageClient } from '../Interfaces/ReplyMessageClient';
import { ReplyMessageManager } from '../Interfaces/ReplyMessageManager';
import { SupportRequestGuard } from '../../guards/support-request.guard';
import { ReplySendMessages } from '../Interfaces/ReplySendMessages';
import { MarkMessagesAsReadDto } from '../dto/MarkMessagesAsReadDto';
import { typeId } from '../../Users/Interfaces/param-id';
import { GetUnreadDto } from '../dto/GetUnreadDto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@app/guards/roles.guard';
import { Roles } from '@app/guards/decorators/role.decorator';
import type { CreateSupportRequestDto } from '../dto/CreateSupportRequestDto';
import { SupportRequestClientService } from '../support-request-client/support-request-client.service';

@Controller('api')
@ApiTags('support-request')
@ApiBearerAuth('bearer')
@UseGuards(AuthJwtGuard, RolesGuard)
export class SupportRequestController {
  constructor(
    private readonly supReqSrv: SupportRequestService,
    private readonly supReqCliServ: SupportRequestClientService,
  ) {}

  @Roles('client')
  @ApiOperation({
    summary: 'Создание обращения в поддержку (только для пользователей с ролью client)',
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не client' })
  @Post('client/support-requests/')
  async createSupportRequest(
    @Req() req,
    @Body() body: CreateSupportRequestDto,
  ): Promise<ReplyMessageClient> {
    const userId = req.user.userId;
    const newData = { ...body };
    newData.user = userId as typeId;
    return await this.supReqCliServ.createSupportRequest(newData);
  }

  @Roles('client')
  @ApiOperation({
    summary:
      'Получение списка обращений в поддержку для клиента (только для пользователей с ролью client)',
  })
  @ApiResponse({ status: 201, description: 'Номер успешно забронирован' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не client' })
  @Get('client/support-requests/') //Метод проверен
  async getListClient(
    @Req() req,
    @Query() body: GetChatListParams,
  ): Promise<ReplyMessageClient[] | ReplyMessageManager[] | undefined> {
    const sessId: string = req.session.userId;
    return await this.supReqSrv.findSupportRequests(body, sessId);
  }

  @Get('/manager/support-requests/') //Метод проверен
  async getListManager(@Query() params: GetChatListParams) {
    return await this.supReqSrv.findSupportRequests(params, '');
  }

  @Get('/common/support-requests/:id/messages') //Метод проверен
  async getHistoryMessage(@Param('id') id: string): Promise<ReplySendMessages[]> {
    return await this.supReqSrv.getMessages(id);
  }

  @Post('/common/support-requests/:id/messages') //Метод проверен
  @UseGuards(SupportRequestGuard)
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
  @UseGuards(SupportRequestGuard)
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
  @UseGuards(SupportRequestGuard)
  async getUnreadCount(@Param('id') supRId: string, @Req() req) {
    const sessId = req.session.userId;
    const data: GetUnreadDto = {
      supRId: supRId as typeId,
      userId: sessId,
    };
    return await this.supReqSrv.prepearingCountMess(data);
  }
}
