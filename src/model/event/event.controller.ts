import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PaginationDto } from 'src/common/dto';
import { ParseIntPipe } from 'src/common/pipe';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('subscribe/:id')
  subscribe(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('username') username: string,
  ) {
    return this.eventService.subscribe(id, username);
  }

  @Get('all')
  getMany(@Query() query: PaginationDto) {
    return this.eventService.getMany(
      query.page,
      query.per_page,
      query.key_search,
    );
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getOne(id);
  }
}
