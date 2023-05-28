import { FileModule } from 'src/model//file/file.module';
import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

@Module({
  imports: [FileModule],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
