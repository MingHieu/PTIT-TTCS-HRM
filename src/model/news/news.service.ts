import { FileService } from 'src/model/file/file.service';
import { Injectable } from '@nestjs/common';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(thumbnail, name, content) {
    const thumbnailUploadedFile = await this.fileService.create(thumbnail);
    await this.prisma.news.create({
      data: {
        thumbnail: thumbnailUploadedFile.url,
        name,
        content,
      },
    });
    return SUCCESS_RESPONSE;
  }

  async update(id, thumbnail, name, content) {
    const data = {
      name,
      content,
    };

    if (thumbnail) {
      const thumbnailUploadedFile = await this.fileService.create(thumbnail);
      Object.assign(data, { thumbnail: thumbnailUploadedFile.url });
    }

    await this.prisma.news.update({
      where: { id },
      data,
    });
    return SUCCESS_RESPONSE;
  }

  async getOne(id) {
    const news = await this.prisma.news.findFirst({
      where: { id },
    });
    return news;
  }

  async getMany(page: number, take: number, keySearch: string) {
    console.log(keySearch);
    const news = await this.prisma.news.findMany({
      where: { name: { contains: keySearch } },
      skip: page * take,
      take,
    });
    const totalNews = await this.prisma.news.count();
    return {
      data: news,
      page,
      per_page: take,
      page_size: news.length,
      total: totalNews,
    };
  }
}
