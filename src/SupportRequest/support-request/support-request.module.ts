import { Module } from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import { SupportRequestController } from './support-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestSchema } from '../schemas/supportRequest.schema';
import { AuthUserGuard } from 'src/guards/auth.guard';
import { UsersModule } from 'src/Users/users.module';
import { SupportRequestClientService } from '../support-request-client/support-request-client.service';
import { Message, MessageSchema } from '../schemas/message.schema';
import { SupportRequestEmployeeService } from '../support-request-employee/support-request-employee.servise';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    SupportRequestModule,
    UsersModule,
  ],
  providers: [
    SupportRequestService,
    AuthUserGuard,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
  controllers: [SupportRequestController],
})
export class SupportRequestModule {}
