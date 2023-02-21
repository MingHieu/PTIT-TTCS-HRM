import { initApi, initApp } from 'src/helpers';

async function bootstrap() {
  await initApi();
  await initApp();
}
bootstrap();
