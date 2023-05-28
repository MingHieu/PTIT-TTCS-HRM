import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  getMany(@Query() query: PaginationDto) {
    return this.newsService.getMany(
      query.page,
      query.per_page,
      query.key_search,
    );
  }
}
