import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Injectable()
export class AdminPhotosService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Adicionar uma nova foto associada a um animal.
   * Valida a existência prévia do pet.
   */
  async addPhoto(petId: number, dto: CreatePhotoDto) {
    const petExists = await this.db.query(
      'SELECT 1 FROM adotai.pets WHERE id_pet = $1',
      [petId]
    );
    if (petExists.length === 0) {
      throw new NotFoundException('Animal não encontrado.');
    }

    const rows = await this.db.query(
      'INSERT INTO adotai.pet_fotos (id_pet, url) VALUES ($1, $2) RETURNING *',
      [petId, dto.url]
    );

    return { message: 'Foto adicionada com sucesso.', foto: rows[0] };
  }

  /**
   * Remover uma foto específica de um animal.
   * Filtra por id_pet e id_foto por segurança para garantir que a foto pertence ao pet correto.
   */
  async removePhoto(petId: number, photoId: number) {
    const rows = await this.db.query(
      'DELETE FROM adotai.pet_fotos WHERE id_foto = $1 AND id_pet = $2 RETURNING *',
      [photoId, petId]
    );

    if (rows.length === 0) {
      throw new NotFoundException('Foto não encontrada para o animal informado.');
    }

    return { message: 'Foto removida com sucesso.' };
  }
}
