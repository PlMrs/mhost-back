import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:4500'
     // origin: "*"
    }
  });

  //Activation de la validation
  app.useGlobalPipes(new ValidationPipe());


  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  );

  //activation du Swagger
  const config = new DocumentBuilder()
  .setTitle('MHOST api')
  .setDescription('Description de l\'utilisation de l\'api Mhost')
  .setVersion('0.1')
  .addTag('mhost')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  //Ecoute du port
  await app.listen(process.env.PORT);
}
bootstrap();
