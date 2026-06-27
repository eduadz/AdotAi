import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class AdminAdoptionRequestsService {
  findAll() {
    // TODO: Implementar SELECT de todos os pedidos de adoção
    // JOIN com adotai.usuarios para retornar dados do solicitante
    // JOIN com adotai.pets para retornar dados do animal
    return [];
  }

  findByPet(petId: number) {
    // TODO: Implementar SELECT pedidos de adoção WHERE id_pet = petId
    // JOIN com adotai.usuarios para retornar dados dos solicitantes
    // Lançar NotFoundException se o pet não existir
    return [];
  }

  accept(requestId: number) {
    // TODO: Implementar UPDATE adotai.pedidos_adocao SET status = 'aceito' WHERE id_pedido = requestId
    // Validar que o status atual é 'pendente'
    // Opcionalmente: atualizar o status do pet para 'em_adocao' ou 'adotado'
    // Lançar NotFoundException se o pedido não existir
    // Lançar BadRequestException se o pedido não estiver pendente
    return { message: 'Pedido de adoção aceito com sucesso.' };
  }

  reject(requestId: number) {
    // TODO: Implementar UPDATE adotai.pedidos_adocao SET status = 'recusado' WHERE id_pedido = requestId
    // Validar que o status atual é 'pendente'
    // Lançar NotFoundException se o pedido não existir
    // Lançar BadRequestException se o pedido não estiver pendente
    return { message: 'Pedido de adoção recusado com sucesso.' };
  }
}
