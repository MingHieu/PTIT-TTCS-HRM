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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
