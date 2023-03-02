import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get('all')
  getMany(@Query() query: PaginationDto) {
    return this.newsService.getMany(
      query.page,
      query.per_page,
      query.key_search,
    );
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.newsService.getOne(id);
  }
}
