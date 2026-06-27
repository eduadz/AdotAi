import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Injectable()
export class AdminPhotosService {
  addPhoto(petId: number, dto: CreatePhotoDto) {
    // TODO: Implementar INSERT em adotai.pet_fotos (id_pet, url)
    // Verificar se o pet existe, lançar NotFoundException caso contrário
    return { message: 'Foto adicionada com sucesso.' };
  }

  removePhoto(petId: number, photoId: number) {
    // TODO: Implementar DELETE de adotai.pet_fotos WHERE id_foto = photoId AND id_pet = petId
    // Lançar NotFoundException se a foto ou o pet não existirem
    return { message: 'Foto removida com sucesso.' };
  }
}
