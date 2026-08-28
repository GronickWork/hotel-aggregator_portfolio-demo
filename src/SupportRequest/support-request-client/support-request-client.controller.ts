/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/*import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SupportRequestClientService } from './support-request-client.service';
import { AuthJwtGuard } from '../../guards/auth.jwt.guard';
import type { CreateSupportRequestDto } from '../dto/CreateSupportRequestDto';
import { ReplyMessageClient } from '../Interfaces/ReplyMessageClient';
import { ApiTags } from '@nestjs/swagger';

@Controller('api')
@ApiTags('')
@UseGuards(AuthJwtGuard)
export class SupportRequestClientController {
  constructor(private readonly SRCService: SupportRequestClientService) {}

  @Post('/client/support-requests/')
  async createSupportRequest(
    @Req() req,
    @Body() body: CreateSupportRequestDto,
  ): Promise<ReplyMessageClient> {
    const sessionId = req.session.userId;
    const newBody: CreateSupportRequestDto = { ...body };
    newBody.user = sessionId;
    return await this.SRCService.createSupportRequest(newBody);
  }
}*/
