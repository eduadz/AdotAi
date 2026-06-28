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
        tipo: 'usuario' // Identificador útil para diferenciar de admin depois
      };

      return {
        message: 'Usuário cadastrado com sucesso!',
        access_token: await this.jwtService.signAsync(payload),
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
    const usuarios = await this.db.query(
      'SELECT * FROM adotai.usuarios WHERE email = $1',
      [loginDto.email],
    );
    const usuario = usuarios[0];

    if (!usuario || usuario.senha_hash !== loginDto.senha) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    const payload = { 
      sub: usuario.id_usuario, 
      email: usuario.email,
      tipo: 'usuario'
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
