import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  // 1. A MÁGICA ACONTECE AQUI: bodyParser: false desativa o limite padrão de 100kb!
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // 2. Agora o nosso parser com limite de 50mb assume o controle sem ser interrompido
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true, 
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('AdotAi API')
    .setDescription('API de adoção de animais — Documentação completa dos endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Autenticação', 'Registro e login de usuário comum')
    .addTag('Usuário - Perfil', 'Visualização e edição de perfil do usuário')
    .addTag('Pets', 'Listagem e detalhes de animais (público)')
    .addTag('Likes', 'Curtidas do usuário em animais')
    .addTag('Pedidos de Adoção', 'Solicitações de adoção do usuário')
    .addTag('Admin - Autenticação', 'Login do administrador')
    .addTag('Admin - Perfil', 'Perfil do administrador')
    .addTag('Admin - Pets', 'Gerenciamento de animais pelo administrador')
    .addTag('Admin - Fotos', 'Gerenciamento de fotos de animais')
    .addTag('Admin - Pedidos de Adoção', 'Gerenciamento de pedidos pelo administrador')
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();