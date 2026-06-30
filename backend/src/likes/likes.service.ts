import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LikesService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Registrar um like do usuário para o animal.
   * Lança ConflictException se o like já existir (chave primária composta).
   */
  async like(userId: number, petId: number) {
    try {
      await this.db.query(
        'INSERT INTO adotai.pet_likes (id_usuario, id_pet) VALUES ($1, $2)',
        [userId, petId]
      );
      return { message: 'Animal curtido com sucesso.' };
    } catch (error: any) {
      // Código de erro do Postgres para violação de unique constraint (unique_violation)
      if (error.code === '23505') {
        throw new ConflictException('Você já curtiu este animal.');
      }
      throw error;
    }
  }

  /**
   * Remover o like do usuário no animal.
   * Lança NotFoundException se a relação de like não existir.
   */
  async unlike(userId: number, petId: number) {
    const result = await this.db.query(
      'DELETE FROM adotai.pet_likes WHERE id_usuario = $1 AND id_pet = $2 RETURNING *',
      [userId, petId]
    );
    if (result.length === 0) {
      throw new NotFoundException('Curtida não encontrada.');
    }
    return { message: 'Curtida removida com sucesso.' };
  }

  /**
   * Retorna a lista de animais que o usuário curtiu, incluindo a foto principal de cada animal.
   */
  async getUserLikes(userId: number) {
    const queryStr = `
      SELECT p.*, (
        SELECT url FROM adotai.pet_fotos pf WHERE pf.id_pet = p.id_pet LIMIT 1
      ) as foto_principal
      FROM adotai.pet_likes pl
      JOIN adotai.pets p ON pl.id_pet = p.id_pet
      WHERE pl.id_usuario = $1
    `;
    return this.db.query(queryStr, [userId]);
  }

  /**
   * Contar o número total de likes que um animal recebeu.
   */
  async getPetLikesCount(petId: number) {
    const rows = await this.db.query(
      'SELECT COUNT(*)::int as count FROM adotai.pet_likes WHERE id_pet = $1',
      [petId]
    );
    return { petId, count: rows[0]?.count || 0 };
  }
}
