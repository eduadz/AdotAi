import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}
async getProfile(userId: number) {
    // Busca o usuário, mas propositalmente exclui a senha_hash do SELECT por segurança
    const usuarios = await this.db.query(
      'SELECT id_usuario, nome, cpf, telefone, email FROM adotai.usuarios WHERE id_usuario = $1',
      [userId],
    );
    
    const usuario = usuarios[0];

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return usuario;
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    try {
      // O COALESCE mantém o valor atual da coluna se o parâmetro ($1, $2, etc) for null.
      // Retornamos os dados limpos direto do UPDATE usando o RETURNING.
      // OBS: Assumimos que o CPF não pode ser alterado, então ele não entra no SET.
      const usuarios = await this.db.query(
        `UPDATE adotai.usuarios 
         SET nome = COALESCE($1, nome), 
             telefone = COALESCE($2, telefone),
             email = COALESCE($3, email) 
         WHERE id_usuario = $4 
         RETURNING id_usuario, nome, cpf, telefone, email`,
        [
          updateUserDto.nome || null, 
          updateUserDto.telefone || null, 
          updateUserDto.email || null, 
          userId
        ],
      );
      
      const usuarioAtualizado = usuarios[0];

      if (!usuarioAtualizado) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      return {
        message: 'Perfil atualizado com sucesso',
        usuario: usuarioAtualizado,
      };

    } catch (error) {
      // 23505 é o código do PostgreSQL para quebra de constraint UNIQUE (ex: e-mail já existe)
      if (error.code === '23505') {
        throw new BadRequestException('Este e-mail já está em uso por outra conta.');
      }
      throw error;
    }
  }
}
