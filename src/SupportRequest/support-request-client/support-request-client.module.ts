import { Module } from '@nestjs/common';
import { SupportRequestClientController } from './support-request-client.controller';
import { SupportRequestClientService } from './support-request-client.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestSchema } from '../schemas/supportRequest.schema';
import { UsersModule } from 'src/Users/users.module';
import { AuthUserGuard } from 'src/guards/auth.guard';
import { Message } from '../schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: Message },
    ]),
    SupportRequestClientModule,
    UsersModule,
  ],
  controllers: [SupportRequestClientController],
  providers: [SupportRequestClientService, AuthUserGuard],
})
export class SupportRequestClientModule {}
