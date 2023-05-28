import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { UserModule } from 'src/model/user/user.module';
import { NewsModule } from './model/news/news.module';
import { AttendanceModule } from './model/attendance/attendance.module';
import { SalaryModule } from './model/salary/salary.module';
import { RequestModule } from './model/request/request.module';
import { EventModule } from './model/event/event.module';
import { NotificationModule } from './model/notification/notification.module';
import { FileModule } from './model/file/file.module';
import { ProjectModule } from './model/project/project.module';
import { SkillModule } from './model/skill/skill.module';
import { SettingModule } from './model/setting/setting.module';

const ENV = process.env.NODE_ENV || 'development';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${ENV}`,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    NewsModule,
    AttendanceModule,
    SalaryModule,
    RequestModule,
    EventModule,
    NotificationModule,
    FileModule,
    ProjectModule,
    SkillModule,
    SettingModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
