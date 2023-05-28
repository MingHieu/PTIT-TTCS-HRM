import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  getMany(@Query() query: PaginationDto) {
    return this.notificationService.getMany(
      query.page,
      query.per_page,
      query.key_search,
    );
  }
}
