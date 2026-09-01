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
import { SendMessageDto } from '../dto/SendMessageDto';
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '@app/guards/roles.guard';
import { Roles } from '@app/guards/decorators/role.decorator';
import { CreateSupportRequestDto } from '../dto/CreateSupportRequestDto';
import { SupportRequestClientService } from './support-request-client.service';
import { GetListRequestDto } from '../dto/get-list-requestDto';

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
  @ApiResponse({ status: 201, description: 'Обращение создано.' })
  @ApiBody({ type: CreateSupportRequestDto })
  @Post('client/support-requests/')
  async createSupportRequest(
    @Req() req,
    @Body() body: CreateSupportRequestDto,
  ): Promise<ReplyMessageClient> {
    const userId = req.user.userId;
    const newData = { ...body };
    newData.user = userId;
    return await this.supReqCliServ.createSupportRequest(newData);
  }

  @Roles('client')
  @ApiOperation({
    summary:
      'Получение списка обращений в поддержку для клиента (только для пользователей с ролью client)',
  })
  @ApiResponse({ status: 200, description: 'Список обращений получен.' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не client' })
  @Get('client/support-requests/') //Метод проверен
  async getListClient(
    @Req() req,
    @Query() body: GetListRequestDto,
  ): Promise<ReplyMessageClient[] | ReplyMessageManager[] | undefined> {
    const idUser = req.user.userId;
    const limit = body.limit ?? 10;
    const offset = body.offset ?? 0;
    const isActive = body.isActive ?? false;
    const params: GetChatListParams = { isActive, user: idUser };
    const list = await this.supReqSrv.findSupportRequests(params, idUser as string);
    return list?.slice(offset, offset + limit);
  }

  @Roles('manager')
  @ApiOperation({
    summary:
      'Получение списка обращений в поддержку для менеджера (только для пользователей с ролью manager)',
  })
  @ApiResponse({ status: 200, description: 'Список обращений получен.' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не manager' })
  @Get('/manager/support-requests/') //Метод проверен
  async getListManager(@Req() req, @Query() body: GetListRequestDto) {
    const idUser = req.user.userId;
    const limit = body.limit ?? 10;
    const offset = body.offset ?? 0;
    const isActive = body.isActive ?? false;
    const params: GetChatListParams = { isActive, user: idUser };
    const list = await this.supReqSrv.findSupportRequests(params, '');
    return list?.slice(offset, offset + limit);
  }

  @Roles('manager', 'client')
  @ApiOperation({
    summary:
      'Получение истории сообщений из обращения в техподдержку (только для пользователей с ролью manager или client, который создал обращение)',
  })
  @ApiResponse({ status: 200, description: 'Список обращений получен.' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не подходит.' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'id обращения' })
  @UseGuards(SupportRequestGuard)
  @Get('/common/support-requests/:id/messages') //Метод проверен
  async getHistoryMessage(@Param('id') id: string): Promise<ReplySendMessages[]> {
    return await this.supReqSrv.getMessages(id);
  }

  @Roles('manager', 'client')
  @ApiOperation({
    summary:
      'Отправление сообщения в чат (только для пользователей с ролью manager или client, который создал обращение)',
  })
  @ApiResponse({ status: 200, description: 'Сообщение отправлено.' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Роль пользователя не подходит.' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'id обращения' })
  @ApiBody({ type: SendMessageDto })
  @UseGuards(SupportRequestGuard)
  @Post('/common/support-requests/:id/messages') //Метод проверен
  async postMessageRequest(
    @Param('id') paramId: string,
    @Body() data: SendMessageDto,
    @Req() req,
  ): Promise<ReplySendMessages> {
    const postMReq: SendMessageDto = {
      author: req.user.userId,
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
