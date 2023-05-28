import { Controller, Get } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  getAll(@GetUser('username') username) {
    return this.projectService.getAllByUsername(username);
  }
}
