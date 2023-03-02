import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PaginationDto } from 'src/common/dto';
import { RequestCreateDto } from './dto';
import { RequestService } from './request.service';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post('create')
  create(
    @Body() body: RequestCreateDto,
    @GetUser('username') username: string,
  ) {
    return this.requestService.create(body, username);
  }

  @Get('all')
  getMany(@Query() query: PaginationDto) {
    return this.requestService.getMany(
      query.page,
      query.per_page,
      query.key_search,
    );
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.requestService.getOne(id);
  }
}
