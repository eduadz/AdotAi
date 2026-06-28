import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private db: DatabaseService,private jwtService: JwtService,) {}
  async register(registerDto: RegisterDto) {
    try{
      // mudar para bycript
      const senhaHash = registerDto.senha;
      const usuarios = await this.db.query(
        `INSERT INTO adotai.usuarios (nome, cpf, telefone, email, senha_hash)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_usuario, nome, email`,
        [
          registerDto.nome,
          registerDto.cpf,
          registerDto.telefone,
          registerDto.email,
          senhaHash,
        ],
      );

      const novoUsuario = usuarios[0];

      // Gera o token automaticamente após o cadastro para o usuário não precisar logar de novo
      const payload = { 
        sub: novoUsuario.id_usuario, 
        email: novoUsuario.email,
        role: 'usuario' // Identificador útil para diferenciar de admin depois
      };

      return {
        message: 'Usuário cadastrado com sucesso!',
        access_token: await this.jwtService.signAsync(payload),
        role: 'usuario'
      };
      
    } catch (error) {
      // O código '23505' é o padrão do PostgreSQL para violação de UNIQUE (ex: email repetido)
      if (error.code === '23505') {
        throw new BadRequestException('Este email ou CPF já estão cadastrados.');
      }
      // Se for outro erro de banco, lançamos para o NestJS tratar
      throw error;
    }
  }
async login(loginDto: LoginDto) {
    // ETAPA 1 — Buscar na tabela de Administradores
    const admins = await this.db.query(
      'SELECT * FROM adotai.administradores WHERE email = $1',
      [loginDto.email],
    );

    if (admins.length > 0) {
      const admin = admins[0];
      
      // Valida a senha do admin
      if (admin.senha_hash !== loginDto.senha) {
        throw new UnauthorizedException('Email ou senha incorretos.');
      }

      const payload = { sub: admin.id_admin, email: admin.email, role: 'admnistrador' };
      return {
        access_token: await this.jwtService.signAsync(payload),
        role: 'admnistrador',
      };
    }

    // ETAPA 2 — Buscar na tabela de Usuários Comuns (só chega aqui se não for admin)
    const usuarios = await this.db.query(
      'SELECT * FROM adotai.usuarios WHERE email = $1',
      [loginDto.email],
    );

    if (usuarios.length > 0) {
      const usuario = usuarios[0];
      
      // Valida a senha do usuário
      if (usuario.senha_hash !== loginDto.senha) {
        throw new UnauthorizedException('Email ou senha incorretos.');
      }

      const payload = { sub: usuario.id_usuario, email: usuario.email, role: 'usuario' };
      return {
        access_token: await this.jwtService.signAsync(payload),
        role: 'usuario',
      };
    }

    // ETAPA 3 — Resposta de Erro (não achou em nenhuma das duas tabelas)
    throw new UnauthorizedException('Email ou senha incorretos.');
  }
}
