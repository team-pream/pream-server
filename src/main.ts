import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '~/app.module';
import { RedocModule, RedocOptions } from 'nestjs-redoc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Pream API Docs')
    .setDescription('Pream API 문서입니다.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const redocOptions: RedocOptions = {
    title: 'Pream API Docs',
    hideDownloadButton: true,
    hideHostname: true,
    auth: {
      enabled: false,
      user: 'pream',
      password: 'preamureca',
    },
  };

  await RedocModule.setup('/api', app, document, redocOptions);

  await app.listen(8000);
}
bootstrap();
