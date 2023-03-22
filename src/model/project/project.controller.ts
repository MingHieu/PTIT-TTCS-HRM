import { Controller, Get, Query, Param } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('all')
  getMany(@Query() query: PaginationDto) {
    return this.projectService.getMany(
      query.page,
      query.per_page,
      query.key_search,
    );
  }

  @Get('all/:username')
  getAllByUsername(@Param('username') username) {
    return this.projectService.getAllByUsername(username);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.projectService.getOne(id);
  }
}
