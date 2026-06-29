import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { UpdatePetStatusDto } from './dto/update-pet-status.dto';

@Injectable()
export class AdminPetsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Cadastrar um novo animal no sistema.
   * Constrói dinamicamente a query com base nos campos definidos no DTO.
   */
  async create(adminId: number, dto: CreatePetDto) {
    const { foto, ...petData } = dto;

    const keys = ['id_admin', ...Object.keys(petData)];
    const placeholders = keys.map((_, i) => `$${i + 1}`);
    const values = [adminId, ...Object.values(petData)];

    const queryStr = `
      INSERT INTO adotai.pets (${keys.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    const rows = await this.db.query(queryStr, values);
    const novoPet = rows[0];

    if (foto) {
      await this.db.query(
        `INSERT INTO adotai.pet_fotos (id_pet, url) VALUES ($1, $2)`,
        [novoPet.id_pet, foto]
      );
    }

    return { message: 'Animal cadastrado com sucesso.', pet: novoPet };
  }

  /**
   * Atualizar os dados de um animal cadastrado.
   * Modifica apenas os campos passados na requisição.
   */
  async update(id: number, dto: UpdatePetDto) {
    const conditions: string[] = [];
    const values: any[] = [];

    Object.keys(dto).forEach((key) => {
      const val = dto[key];
      if (val !== undefined) {
        values.push(val);
        conditions.push(`${key} = $${values.length}`);
      }
    });

    if (conditions.length === 0) {
      return { message: 'Nenhuma alteração enviada.' };
    }

    values.push(id);
    const idPlaceholder = `$${values.length}`;

    const queryStr = `
      UPDATE adotai.pets
      SET ${conditions.join(', ')}
      WHERE id_pet = ${idPlaceholder}
      RETURNING *
    `;

    const rows = await this.db.query(queryStr, values);
    if (rows.length === 0) {
      throw new NotFoundException('Animal não encontrado.');
    }
    return { message: 'Animal atualizado com sucesso.', pet: rows[0] };
  }

  /**
   * Remover um animal do sistema.
   * O ON DELETE CASCADE configurado no banco removerá fotos e curtidas associadas.
   */
  async remove(id: number) {
    const rows = await this.db.query(
      'DELETE FROM adotai.pets WHERE id_pet = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      throw new NotFoundException('Animal não encontrado.');
    }
    return { message: 'Animal removido com sucesso.' };
  }

  /**
   * Atualizar apenas o status de um animal (ex: disponivel, adotado).
   */
  async updateStatus(id: number, dto: UpdatePetStatusDto) {
    const rows = await this.db.query(
      'UPDATE adotai.pets SET status = $1 WHERE id_pet = $2 RETURNING *',
      [dto.status, id]
    );
    if (rows.length === 0) {
      throw new NotFoundException('Animal não encontrado.');
    }
    return { message: 'Status do animal atualizado com sucesso.', pet: rows[0] };
  }
}