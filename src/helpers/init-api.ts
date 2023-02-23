import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtGuard } from 'src/auth/guard';
import { LoggingInterceptor } from 'src/common/interceptors';
import { ApiModule } from 'src/api.module';

export const initApi = async () => {
  const api = await NestFactory.create(ApiModule);
  const reflector = api.get(Reflector);
  api.useGlobalGuards(new JwtGuard(reflector));
  api.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  api.useGlobalInterceptors(new LoggingInterceptor());
  api.setGlobalPrefix('api');

  // await api.listen(8080);
  return api;
};
