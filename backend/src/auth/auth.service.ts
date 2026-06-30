import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private db: DatabaseService, private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    try {     
      const senhaHash = await argon2.hash(registerDto.senha);

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
      const payload = { sub: novoUsuario.id_usuario, email: novoUsuario.email, role: 'usuario' };

      return {
        message: 'Usuário cadastrado com sucesso!',
        access_token: await this.jwtService.signAsync(payload),
        role: 'usuario'
      };
      
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Este email ou CPF já estão cadastrados.');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    // Busca Administrador
    const admins = await this.db.query('SELECT * FROM adotai.administradores WHERE email = $1', [loginDto.email]);

    if (admins.length > 0) {
      const admin = admins[0];
      // Verifica a senha do administrador
      const isSenhaValida = await argon2.verify(admin.senha_hash, loginDto.senha);
      
      if (!isSenhaValida) throw new UnauthorizedException('Email ou senha incorretos.');

      const payload = { sub: admin.id_admin, email: admin.email, role: 'administrador' };
      return { access_token: await this.jwtService.signAsync(payload), role: 'administrador' };
    }

    // Busca Usuário comum
    const usuarios = await this.db.query('SELECT * FROM adotai.usuarios WHERE email = $1', [loginDto.email]);

    if (usuarios.length > 0) {
      const usuario = usuarios[0];
      // Verifica a senha do usuário
      const isSenhaValida = await argon2.verify(usuario.senha_hash, loginDto.senha);
      
      if (!isSenhaValida) throw new UnauthorizedException('Email ou senha incorretos.');

      const payload = { sub: usuario.id_usuario, email: usuario.email, role: 'usuario' };
      return { access_token: await this.jwtService.signAsync(payload), role: 'usuario' };
    }

    throw new UnauthorizedException('Email ou senha incorretos.');
  }
}