/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HandlerFilesService } from '@app/handler-files/handler-files.service';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import path from 'path';

@Injectable()
export class FilesRoomInterceptor implements NestInterceptor {
  constructor(private readonly fileService: HandlerFilesService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const dir = path.join(process.cwd(), 'imgStorage');
    const paths: string[] = []; // локальная переменная — без бага с this

    const request = context.switchToHttp().getRequest(); // Перехват тела запроса
    if (!request.files) return next.handle();
    for (const file of request.files) {
      if (!this.fileService.typeFilter(file.mimetype)) {
        throw new BadRequestException('Недопустимый тип файла');
      }
      const savedPath = await this.fileService.handlerFile(file, dir);
      paths.push(savedPath);
    }
    request.body = { ...request.body, images: paths };
    return next.handle();
  }
}
