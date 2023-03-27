import { Controller, Get } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { SalaryService } from './salary.service';

@Controller('salary')
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @Get()
  getAllByUsername(@GetUser('username') username) {
    return this.salaryService.getAllByUsername(username);
  }
}
