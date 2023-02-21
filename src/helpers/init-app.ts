import { JwtCookieGuard } from 'src/auth/guard';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { LoggingInterceptor } from 'src/common/interceptors';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'express-handlebars';
import { NotFoundExceptionFilter } from 'src/common/filters';

export const initApp = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalGuards(new JwtCookieGuard(reflector));

  app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));

  app.engine(
    'hbs',
    hbs.engine({
      extname: 'hbs',
      defaultLayout: 'main',
      layoutsDir: join(__dirname, '..', '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', '..', 'views', 'partials'),
    }),
  );
  app.setViewEngine('hbs');

  await app.listen(3000);
};
