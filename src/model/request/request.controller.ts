import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { RequestCreateDto } from './dto';
import { RequestService } from './request.service';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post('create')
  create(@Body() body: RequestCreateDto, @GetUser('username') username) {
    return this.requestService.create(body, username);
  }

  @Get()
  getAll(@GetUser('username') username) {
    return this.requestService.getAllByUsername(username);
  }
}
