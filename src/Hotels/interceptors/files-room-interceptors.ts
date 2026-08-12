/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HandlerFilesService } from '@app/handler-files/handler-files.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FilesRoomInterceptor implements NestInterceptor {
  allowedTypes: string[];
  dir: string;
  constructor(private readonly fileService: HandlerFilesService) {
    this.allowedTypes = [
      // Разрешенные типы файлов
      'image/png',
      'image/jpg',
      'image/jpeg',
      'application/pdf',
    ];
    this.dir = 'imgStorage';
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest(); // Перехват тела запроса
    if (!request.files) return next.handle();
    const paths = await this.fileService.prepareFiles(request.files); // только подготовка путей
    const newBody = { ...request.body, images: paths };
    request.body = newBody;
    return next.handle();
  }

  testTypeFile(mimeType: string): boolean {
    return this.allowedTypes.includes(mimeType) ? true : false;
  }
}
