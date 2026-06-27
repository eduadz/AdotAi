import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';

@Injectable()
export class AdoptionRequestsService {
  create(userId: number, petId: number, dto: CreateAdoptionRequestDto) {
    // TODO: Implementar INSERT em adotai.pedidos_adocao com status 'pendente'
    // Verificar se o pet existe e está com status 'disponivel'
    // Lançar ConflictException se já existir pedido deste usuário para este pet (UNIQUE constraint)
    return { message: 'Pedido de adoção criado com sucesso.' };
  }

  findByUser(userId: number) {
    // TODO: Implementar SELECT pedidos do usuário
    // JOIN com adotai.pets para retornar dados do animal junto
    // JOIN com adotai.pet_fotos para incluir foto principal
    return [];
  }

  cancel(userId: number, requestId: number) {
    // TODO: Implementar UPDATE status para 'cancelado' em adotai.pedidos_adocao
    // Validar que o pedido pertence ao userId
    // Validar que o status atual é 'pendente' (não pode cancelar pedido já aceito/recusado)
    // Lançar NotFoundException se o pedido não existir
    // Lançar BadRequestException se o pedido não estiver pendente
    return { message: 'Pedido de adoção cancelado com sucesso.' };
  }
}
