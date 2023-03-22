import { Controller, Get, Param } from '@nestjs/common';
import { SalaryService } from './salary.service';

@Controller('salary')
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @Get('all/:username')
  getAllByUsername(@Param('username') username) {
    return this.salaryService.getAllByUsername(username);
  }
}
