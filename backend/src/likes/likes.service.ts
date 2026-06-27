import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';

@Injectable()
export class LikesService {
  like(userId: number, petId: number) {
    // TODO: Implementar INSERT em adotai.pet_likes (id_usuario, id_pet)
    // Lançar ConflictException se o like já existir (chave primária composta)
    return { message: 'Animal curtido com sucesso.' };
  }

  unlike(userId: number, petId: number) {
    // TODO: Implementar DELETE de adotai.pet_likes WHERE id_usuario = userId AND id_pet = petId
    // Lançar NotFoundException se o like não existir
    return { message: 'Curtida removida com sucesso.' };
  }

  getUserLikes(userId: number) {
    // TODO: Implementar SELECT dos pets curtidos pelo usuário
    // JOIN adotai.pet_likes com adotai.pets e adotai.pet_fotos
    return [];
  }

  getPetLikesCount(petId: number) {
    // TODO: Implementar COUNT de likes do pet em adotai.pet_likes WHERE id_pet = petId
    return { petId, count: 0 };
  }
}
