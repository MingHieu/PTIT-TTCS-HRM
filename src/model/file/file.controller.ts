import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ParseIntPipe } from 'src/common/pipe';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.fileService.getOne(id, res);
  }
}
