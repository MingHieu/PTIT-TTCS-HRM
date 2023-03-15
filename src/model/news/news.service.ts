import { FileService } from 'src/model/file/file.service';
import { Injectable } from '@nestjs/common';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { NewsCreateDto, NewsUpdateDto } from './dto';

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(body: NewsCreateDto, thumbnail?: File) {
    if (thumbnail) {
      const thumbnailUploadedFile = await this.fileService.create(thumbnail);
      Object.assign(body, { thumbnail: thumbnailUploadedFile.url });
    }

    await this.prisma.news.create({
      data: {
        ...body,
      },
    });
    return SUCCESS_RESPONSE;
  }

  async update(body: NewsUpdateDto, thumbnail?: File) {
    const { id, ...data } = body;

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

  async getOne(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });
    return news;
  }

  async getMany(page: number, perPage: number, keySearch: string) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;
    if (!keySearch) keySearch = '';
    page--;
    const news = await this.prisma.news.findMany({
      where: { name: { contains: keySearch } },
      skip: page * perPage,
      take: perPage,
      orderBy: { createAt: 'desc' },
    });
    const totalNews = await this.prisma.news.count();
    return {
      data: news,
      page,
      per_page: perPage,
      page_size: news.length,
      total: totalNews,
    };
  }

  async delete(id: number) {
    await this.prisma.news.delete({ where: { id } });
    return SUCCESS_RESPONSE;
  }
}
