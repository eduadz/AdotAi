import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { UpdatePetStatusDto } from './dto/update-pet-status.dto';

@Injectable()
export class AdminPetsService {
  create(adminId: number, dto: CreatePetDto) {
    // TODO: Implementar INSERT em adotai.pets com id_admin = adminId
    return { message: 'Animal cadastrado com sucesso.' };
  }

  update(id: number, dto: UpdatePetDto) {
    // TODO: Implementar UPDATE em adotai.pets WHERE id_pet = id
    // Lançar NotFoundException se o pet não existir
    // Atualizar apenas os campos presentes no DTO
    return { message: 'Animal atualizado com sucesso.' };
  }

  remove(id: number) {
    // TODO: Implementar DELETE de adotai.pets WHERE id_pet = id
    // As fotos serão removidas automaticamente pelo ON DELETE CASCADE
    // Lançar NotFoundException se o pet não existir
    return { message: 'Animal removido com sucesso.' };
  }

  updateStatus(id: number, dto: UpdatePetStatusDto) {
    // TODO: Implementar UPDATE adotai.pets SET status = dto.status WHERE id_pet = id
    // Lançar NotFoundException se o pet não existir
    return { message: 'Status do animal atualizado com sucesso.' };
  }
}
