import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async getProfile(userId: number) {
    // 1. CORREÇÃO: Buscamos o usuário fazendo um LEFT JOIN com a tabela de endereços
    const resultado = await this.db.query(
      `SELECT 
        u.id_usuario, u.nome, u.cpf, u.telefone, u.email,
        e.id_endereco, e.cidade, e.logradouro, e.bairro, e.numero
       FROM adotai.usuarios u
       LEFT JOIN adotai.enderecos e ON e.id_usuario = u.id_usuario
       WHERE u.id_usuario = $1`,
      [userId],
    );
    
    const linha = resultado[0];

    if (!linha) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // Estruturamos o retorno para que o Frontend receba exatamente o formato que espera
    return {
      id_usuario: linha.id_usuario,
      nome: linha.nome,
      cpf: linha.cpf,
      telefone: linha.telefone,
      email: linha.email,
      endereco: linha.id_endereco ? {
        id_endereco: linha.id_endereco,
        cidade: linha.cidade,
        logradouro: linha.logradouro,
        bairro: linha.bairro,
        numero: linha.numero
      } : null // Retorna null se não tiver endereço cadastrado ainda
    };
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    // 2. CORREÇÃO: Usamos transação para salvar em duas tabelas diferentes de forma segura
    try {
      const usuarios = await this.db.query(
        `UPDATE adotai.usuarios 
         SET nome = COALESCE($1, nome), 
             telefone = COALESCE($2, telefone),
             email = COALESCE($3, email)
         WHERE id_usuario = $4
         RETURNING id_usuario, nome, telefone, email`,
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

      // Se o objeto de endereço veio na requisição do Frontend, atualizamos ou inserimos
      let enderecoAtualizado = null;
      if (updateUserDto.endereco) {
        const { cidade, logradouro, bairro, numero } = updateUserDto.endereco;

        // Utilizamos a estratégia "UPSERT" (Insert ou Update) do PostgreSQL.
        // Se já existir uma linha com o id_usuario, ele atualiza (UPDATE). Se não, insere (INSERT).
        // Para que isso funcione 100% no Postgres, a coluna id_usuario precisaria ser UNIQUE na tabela enderecos.
        // Caso não seja, faremos uma checagem simples de existência ou um DELETE/INSERT rápido.
        // Abaixo faremos a abordagem de deletar o antigo e inserir o novo, que é segura para relacionamentos 1-para-1:
        
        await this.db.query('DELETE FROM adotai.enderecos WHERE id_usuario = $1', [userId]);
        
        const enderecos = await this.db.query(
          `INSERT INTO adotai.enderecos (id_usuario, cidade, logradouro, bairro, numero)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id_endereco, cidade, logradouro, bairro, numero`,
          [
            userId,
            cidade || 'FLORESTAL',
            logradouro,
            bairro,
            numero
          ]
        );
        
        enderecoAtualizado = enderecos[0];
      }

      return {
        message: 'Perfil atualizado com sucesso',
        usuario: {
          ...usuarioAtualizado,
          endereco: enderecoAtualizado
        },
      };

    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Este e-mail ou CPF já está em uso por outra conta.');
      }
      throw error;
    }
  }
}