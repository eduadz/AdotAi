import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service'; // Ajuste o caminho se necessário
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private jwtService: JwtService,
    private db: DatabaseService, // Injeta a sua classe que gerencia o pg
  ) {}

  async login(adminLoginDto: AdminLoginDto) {
    // 1. Busca o admin no schema correto usando Query Parametrizada ($1) para evitar SQL Injection
    const admins = await this.db.query(
      'SELECT * FROM adotai.administradores WHERE email = $1',
      [adminLoginDto.email],
    );
    const admin = admins[0];

    // NOTE: Aqui estou comparando texto puro 
    // Em prod, você deve usar: await bcrypt.compare(adminLoginDto.senha, admin.senha_hash)
    if (!admin || admin.senha_hash !== adminLoginDto.senha) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    const payload = { 
      sub: admin.id_admin, 
      email: admin.email 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(adminId: number) {
    const admins = await this.db.query(
      'SELECT id_admin, nome, email FROM adotai.administradores WHERE id_admin = $1',
      [adminId],
    );
    const admin = admins[0];

    if (!admin) {
      throw new NotFoundException('Administrador não encontrado.');
    }

    return admin;
  }

  async updateProfile(adminId: number, updateAdminDto: UpdateAdminDto) {
    const admins = await this.db.query(
      `UPDATE adotai.administradores 
       SET nome = COALESCE($1, nome), 
           email = COALESCE($2, email) 
       WHERE id_admin = $3 
       RETURNING id_admin, nome, email`,
      [updateAdminDto.nome || null, updateAdminDto.email || null, adminId],
    );
    
    const adminAtualizado = admins[0];

    if (!adminAtualizado) {
      throw new NotFoundException('Administrador não encontrado.');
    }

    return {
      message: 'Perfil atualizado com sucesso',
      admin: adminAtualizado,
    };
  }
}