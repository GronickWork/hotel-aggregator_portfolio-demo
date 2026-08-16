import { Module } from '@nestjs/common';
import { HandlerFilesService } from './handler-files.service';

@Module({
  providers: [HandlerFilesService],
  exports: [HandlerFilesModule],
})
export class HandlerFilesModule {}
