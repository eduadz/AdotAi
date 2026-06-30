import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AdminAdoptionRequestsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Listar todos os pedidos de adoção efetuados no sistema.
   * Retorna dados completos do solicitante e do pet.
   */
  async findAll() {
    const queryStr = `
      SELECT pa.*, 
        json_build_object(
          'id_usuario', u.id_usuario,
          'nome', u.nome,
          'email', u.email,
          'telefone', u.telefone
        ) as usuario,
        json_build_object(
          'id_pet', p.id_pet,
          'nome', p.nome,
          'tipo', p.tipo,
          'status', p.status
        ) as pet
      FROM adotai.pedidos_adocao pa
      JOIN adotai.usuarios u ON pa.id_usuario = u.id_usuario
      JOIN adotai.pets p ON pa.id_pet = p.id_pet
    `;
    return this.db.query(queryStr);
  }

  /**
   * Listar pedidos de adoção específicos de um único animal.
   * Lança NotFoundException se o animal não existir.
   */
  async findByPet(petId: number) {
    const petExists = await this.db.query(
      'SELECT 1 FROM adotai.pets WHERE id_pet = $1',
      [petId]
    );
    if (petExists.length === 0) {
      throw new NotFoundException('Animal não encontrado.');
    }

    const queryStr = `
      SELECT pa.*,
        json_build_object(
          'id_usuario', u.id_usuario,
          'nome', u.nome,
          'email', u.email,
          'telefone', u.telefone
        ) as usuario
      FROM adotai.pedidos_adocao pa
      JOIN adotai.usuarios u ON pa.id_usuario = u.id_usuario
      WHERE pa.id_pet = $1
    `;
    return this.db.query(queryStr, [petId]);
  }

  /**
   * Aceitar um pedido de adoção pendente.
   * Muda o status do pedido para 'aceito' e altera o status do pet para 'adotado' imediatamente.
   */
  async accept(requestId: number) {
    const requests = await this.db.query(
      'SELECT id_pet, status FROM adotai.pedidos_adocao WHERE id_pedido = $1',
      [requestId]
    );

    if (requests.length === 0) {
      throw new NotFoundException('Pedido de adoção não encontrado.');
    }

    if (requests[0].status !== 'pendente') {
      throw new BadRequestException('Apenas pedidos com status pendente podem ser aceitos.');
    }

    const petId = requests[0].id_pet;

    // Atualiza o pedido e o status do pet
    await this.db.query(
      "UPDATE adotai.pedidos_adocao SET status = 'aceito' WHERE id_pedido = $1",
      [requestId]
    );

    await this.db.query(
      "UPDATE adotai.pets SET status = 'adotado' WHERE id_pet = $1",
      [petId]
    );

    return { message: 'Pedido de adoção aceito com sucesso.' };
  }

  /**
   * Recusar um pedido de adoção pendente.
   * O pet permanece disponível para outras adoções.
   */
  async reject(requestId: number) {
    const requests = await this.db.query(
      'SELECT status FROM adotai.pedidos_adocao WHERE id_pedido = $1',
      [requestId]
    );

    if (requests.length === 0) {
      throw new NotFoundException('Pedido de adoção não encontrado.');
    }

    if (requests[0].status !== 'pendente') {
      throw new BadRequestException('Apenas pedidos com status pendente podem ser recusados.');
    }

    await this.db.query(
      "UPDATE adotai.pedidos_adocao SET status = 'recusado' WHERE id_pedido = $1",
      [requestId]
    );

    return { message: 'Pedido de adoção recusado com sucesso.' };
  }
}
