import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
