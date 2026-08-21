import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { nanoid } from 'nanoid';
import path from 'path';
import { Express } from 'express';

@Injectable()
export class HandlerFilesService {
  allowedTypes: string[];
  constructor() {
    this.allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
  }

  async handlerFile(file: Express.Multer.File, dir: string): Promise<string> {
    const baseName = path.basename(file.originalname);
    const storFiles = await fs.promises.readdir(dir);
    console.log('from HandlerFilesService baseName: ', baseName);
    if (storFiles.includes(baseName)) {
      // update: перезаписываем файл
      console.log('from HandlerFilesService: file is includes in storFiles');
      const pathFile = path.join(dir, baseName);
      await fs.promises.writeFile(pathFile, file.buffer);
      return path.relative(process.cwd(), pathFile).replace(/\\/g, '/');
    } else {
      // create: уникальное имя через nanoid
      console.log('from HandlerFilesService: file is not includes in storFiles');
      const uniqueName = `${nanoid(5)}_${baseName}`;
      const pathFile = path.join(dir, uniqueName);
      await fs.promises.writeFile(pathFile, file.buffer);
      return path.relative(process.cwd(), pathFile).replace(/\\/g, '/');
    }
  }

  typeFilter(mimeType: string): boolean {
    return this.allowedTypes.includes(mimeType) ? true : false;
  }
}
