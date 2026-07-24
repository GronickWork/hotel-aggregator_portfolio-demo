/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SupportRequestClientService } from './support-request-client.service';
import { AuthUserGuard } from 'src/guards/auth.guard';
import type { CreateSupportRequestDto } from '../Interfaces/dto/CreateSupportRequestDto';
import { ReplyMessageClient } from '../Interfaces/ReplyMessageClient';

@Controller('api')
export class SupportRequestClientController {
  constructor(private readonly SRCService: SupportRequestClientService) {}

  @Post('/client/support-requests/')
  @UseGuards(AuthUserGuard)
  async createSupportRequest(
    @Req() req,
    @Body() body: CreateSupportRequestDto,
  ): Promise<ReplyMessageClient> {
    const sessionId = req.session.userId;
    const newBody: CreateSupportRequestDto = { ...body };
    newBody.user = sessionId;
    return await this.SRCService.createSupportRequest(newBody);
  }
}
