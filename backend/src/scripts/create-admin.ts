import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DatabaseService } from '../database/database.service';
import * as argon2 from 'argon2';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const db = app.get(DatabaseService);

  const args = process.argv.slice(2);
  const nome = args[0];
  const email = args[1];
  const senha = args[2];

  if (!nome || !email || !senha) {
    console.error('\nErro: Parâmetros insuficientes.');
    console.log('Uso correto: npm run script:create-admin -- "Nome Do Admin" "email@adotai.com" "senha123"\n');
    await app.close();
    process.exit(1);
  }

  try {
    const senhaHash = await argon2.hash(senha);
    await db.query(
      `INSERT INTO adotai.administradores (nome, email, senha_hash) 
       VALUES ($1, $2, $3)`,
      [nome, email, senhaHash],
    );

    console.log(`\nSucesso: Administrador "${nome}" cadastrado!\n`);
  } catch (error: any) {
    if (error.code === '23505') {
      console.error('\nErro: Este e-mail já está cadastrado como administrador.\n');
    } else {
      console.error('\nErro inesperado ao executar o script:', error.message, '\n');
    }
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();