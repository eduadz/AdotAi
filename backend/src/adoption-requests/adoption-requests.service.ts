import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';

@Injectable()
export class AdoptionRequestsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Solicitar adoção de um animal.
   * Verifica se o animal existe e está disponível, e previne pedidos duplicados.
   */
  async create(userId: number, petId: number, dto: CreateAdoptionRequestDto) {
    // 1. Verifica se o pet existe e se o status é 'disponivel'
    const pets = await this.db.query(
      'SELECT status FROM adotai.pets WHERE id_pet = $1',
      [petId]
    );

    if (pets.length === 0) {
      throw new NotFoundException('Animal não encontrado.');
    }

    if (pets[0].status !== 'disponivel') {
      throw new BadRequestException('Este animal não está disponível para adoção.');
    }

    try {
      // 2. Tenta inserir o pedido de adoção
      await this.db.query(
        'INSERT INTO adotai.pedidos_adocao (id_usuario, id_pet, mensagem, status) VALUES ($1, $2, $3, $4)',
        [userId, petId, dto.mensagem || null, 'pendente']
      );
      return { message: 'Pedido de adoção criado com sucesso.' };
    } catch (error: any) {
      // Violação de constraint UNIQUE para id_usuario e id_pet
      if (error.code === '23505') {
        throw new ConflictException('Você já enviou um pedido de adoção para este animal.');
      }
      throw error;
    }
  }

  /**
   * Listar todos os pedidos de adoção do próprio usuário, incluindo detalhes do animal e uma foto principal.
   */
  async findByUser(userId: number) {
    const queryStr = `
      SELECT pa.*, json_build_object(
        'id_pet', p.id_pet,
        'nome', p.nome,
        'tipo', p.tipo,
        'status', p.status,
        'foto_principal', (SELECT url FROM adotai.pet_fotos pf WHERE pf.id_pet = p.id_pet LIMIT 1)
      ) as pet
      FROM adotai.pedidos_adocao pa
      JOIN adotai.pets p ON pa.id_pet = p.id_pet
      WHERE pa.id_usuario = $1
    `;
    return this.db.query(queryStr, [userId]);
  }

  /**
   * Cancelar um pedido de adoção feito pelo usuário.
   * O cancelamento só é permitido se o status atual for 'pendente'.
   */
  async cancel(userId: number, requestId: number) {
    const requests = await this.db.query(
      'SELECT id_usuario, status FROM adotai.pedidos_adocao WHERE id_pedido = $1',
      [requestId]
    );

    if (requests.length === 0 || requests[0].id_usuario !== userId) {
      throw new NotFoundException('Pedido de adoção não encontrado.');
    }

    if (requests[0].status !== 'pendente') {
      throw new BadRequestException('Apenas pedidos com status pendente podem ser cancelados.');
    }

    await this.db.query(
      "UPDATE adotai.pedidos_adocao SET status = 'cancelado' WHERE id_pedido = $1",
      [requestId]
    );

    return { message: 'Pedido de adoção cancelado com sucesso.' };
  }
}
