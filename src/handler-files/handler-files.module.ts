import { Module } from '@nestjs/common';
import { HandlerFilesService } from './handler-files.service';

@Module({
  providers: [HandlerFilesService],
})
export class HandlerFilesModule {}
