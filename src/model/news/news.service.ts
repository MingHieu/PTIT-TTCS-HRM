import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

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
