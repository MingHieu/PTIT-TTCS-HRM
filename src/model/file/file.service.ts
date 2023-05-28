import { PrismaService } from 'src/database/prisma/prisma.service';
import { Injectable, StreamableFile } from '@nestjs/common';
import {
  bufferToStream,
  convertBase64ToFile,
  convertFileToBase64,
} from 'src/helpers';
import { Response } from 'express';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async create(file: File) {
    const fileUploaded = await this.prisma.file.create({
      data: { content: convertFileToBase64(file) },
    });
    return { url: `/file/${fileUploaded.id}` };
  }

  async getOne(id: number, res: Response) {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });
    const fileContent = convertBase64ToFile(file.content);
    const readStream = bufferToStream(Buffer.from(fileContent.buffer.data));
    res.set({
      'Content-Type': `${fileContent.mimetype}`,
    });
    return new StreamableFile(readStream);
  }
}
