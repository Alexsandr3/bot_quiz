import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './main/config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<ConfigType>);
  const port = configService.get('PORT', { infer: true });
  await app.listen(port).then(async () => console.log(`Server is listening on ${await app.getUrl()}`));
}

bootstrap();
