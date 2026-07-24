/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HotelService } from '../hotel/hotel.service';
import path, { join } from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid';
type UploadedFile = Express.Multer.File;

@Injectable()
export class RoomFilesInterceptor implements NestInterceptor {
  allowedTypes: string[];
  dir: string;
  constructor(private readonly HlServise: HotelService) {
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
    if (!request.files || !Array.isArray(request.files))
      return next.handle().pipe(map(() => 'Не передано ни одного файла.'));
    for (const file of request.files) {
      if (typeof file === 'string') return next.handle();
      if (!this.fileFilter(file.mimetype)) {
        return next.handle().pipe(map(() => 'Недопустимый тип файла.'));
      }
      file.originalname = await this.saveImageStorage(file); // При необходимости, переимновываем файл уникальным именем и сохраняем его в папку imgStorage.
    }
    const newBody = { ...request.body };
    if (!newBody.images) newBody.images = [];
    if (typeof newBody.images === 'string') newBody.images = [newBody.images]; // Если images - строка, преобразуем в массив
    for (const file of request.files) {
      if (typeof file === 'string') return next.handle();
      newBody.images.push(`${this.dir}/${file.originalname}`);
    }
    request.body = newBody;
    return next.handle().pipe(map((data) => data));
  }

  fileFilter(mimeType: string): boolean {
    return this.allowedTypes.includes(mimeType) ? true : false;
  }

  async saveImageStorage(file: UploadedFile): Promise<void | string> {
    try {
      /**Генерация уникального имени файла - можно раскомментировать и использовать при необходимости
       * функция writeFile() - не записывает файл, если он уже существует, поэтому при генерации уникального имени файла с помощью nanoid,
       *  файлы будут записываться каждый раз с новым именем, т.к. имя файла будет уникальным, и функция writeFile() будет создавать новый файл,
       *  а не перезаписывать существующий в случае использования функции saveImageStorage() в методе update().
       */
      //file.originalname = `${nanoid(5)}_${file.originalname}`;
      const storFiles = await fs.promises.readdir(join(process.cwd(), this.dir));
      if (!storFiles.includes(file.originalname))
        /**
         *  Если файл с таким именем уже существует, значит используется метод update(), и нужно перезаписать существующий файл.
         *  В противном случае, используется метод create(), и нужно сохранить файл с уникальным именем, сгенерированным с помощью nanoid.
         */
        file.originalname = `${nanoid(5)}_${file.originalname}`;
      const filePath = path.join(this.dir, file.originalname);
      await fs.promises.writeFile(filePath, file.buffer);
    } catch (err) {
      console.error('Ошибка при сохранении файла:', err);
    }
    return file.originalname;
  }
}
