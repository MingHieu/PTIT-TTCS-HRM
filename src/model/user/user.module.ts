import { SettingModule } from 'src/model/setting/setting.module';
import { FileModule } from 'src/model/file/file.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [FileModule, SettingModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
