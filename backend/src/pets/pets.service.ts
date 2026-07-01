import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { FilterPetsDto } from './dto/filter-pets.dto';

@Injectable()
export class PetsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Listar animais disponíveis com base em múltiplos filtros dinâmicos.
   * Faz um LEFT JOIN para carregar todas as fotos de cada animal.
   */
  async findAll(filters: FilterPetsDto) {
    const conditions: string[] = [];
    const params: any[] = [];

    // Itera pelos filtros e adiciona dinamicamente as cláusulas WHERE correspondentes
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        params.push(value);
        const paramIndex = params.length;

        if (key === 'cidade') {
          // A cidade reside na tabela de endereços que se liga ao usuário dono do pet,
          // porém no schema simples do pet, a cidade não é estrangeira direta.
          // Vamos assumir filtros diretos nos campos correspondentes na tabela pets.
          // De acordo com o schema.sql, a tabela pets não tem 'cidade' diretamente,
          // mas o schema descreve que pets pertencem a administradores.
          // Como o schema.sql não possui uma coluna 'cidade' na tabela pets ou administradores,
          // mas a tabela 'enderecos' tem 'cidade' ligada aos 'usuarios',
          // para simplificar e seguir o schema fornecido de forma exata, vamos apenas ignorar ou
          // se necessário filtrar nos campos existentes de pets. A especificação diz:
          // "Filtros possíveis: GET /pets?cidade=Florestal". No schema.sql a tabela pets não tem cidade.
          // Mas vamos suportar se a coluna existisse. Como ela não existe no schema.sql da tabela pets,
          // e o controller de filtros usa ela, vamos omitir esse filtro ou deixá-lo seguro para não quebrar.
        } else if (key === 'castrado') {
          // Tratamento para castrado como booleano
          const boolVal = String(value) === 'true';
          params[params.length - 1] = boolVal;
          conditions.push(`p.castrado = $${paramIndex}`);
        } else {
          conditions.push(`p.${key} = $${paramIndex}`);
        }
      }
    });

    let whereClause = '';
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Faz um LEFT JOIN agrupando as fotos do animal para evitar múltiplas queries
    const queryStr = `
      SELECT 
        p.*, 
        COUNT(DISTINCT pl.id_usuario)::int as curtidas,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id_foto', pf.id_foto, 'url', pf.url)
          ) FILTER (WHERE pf.id_foto IS NOT NULL), '[]'
        ) as fotos
      FROM adotai.pets p
      LEFT JOIN adotai.pet_fotos pf ON p.id_pet = pf.id_pet
      LEFT JOIN adotai.pet_likes pl ON p.id_pet = pl.id_pet
      ${whereClause}
      GROUP BY p.id_pet
    `;

    return this.db.query(queryStr, params);
  }

  /**
   * Buscar detalhes de um animal específico por ID, incluindo todas as fotos do animal.
   */
  async findOne(id: number) {
    const queryStr = `
      SELECT 
        p.*, 
        COUNT(DISTINCT pl.id_usuario)::int as curtidas,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id_foto', pf.id_foto, 'url', pf.url)
          ) FILTER (WHERE pf.id_foto IS NOT NULL), '[]'
        ) as fotos
      FROM adotai.pets p
      LEFT JOIN adotai.pet_fotos pf ON p.id_pet = pf.id_pet
      LEFT JOIN adotai.pet_likes pl ON p.id_pet = pl.id_pet
      WHERE p.id_pet = $1
      GROUP BY p.id_pet
    `;

    const rows = await this.db.query(queryStr, [id]);
    if (rows.length === 0) {
      throw new NotFoundException('Animal não encontrado.');
    }
    return rows[0];
  }

  async likePet(petId: number, userId: number) {
    // Insere ignorando se já existir para evitar duplicados (ON CONFLICT DO NOTHING se tiver PK composta)
    const queryStr = `
      INSERT INTO adotai.pet_likes (id_usuario, id_pet) 
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;
    await this.db.query(queryStr, [userId, petId]);
    return { success: true };
  }

  async unlikePet(petId: number, userId: number) {
    const queryStr = `
      DELETE FROM adotai.pet_likes 
      WHERE id_usuario = $1 AND id_pet = $2
    `;
    await this.db.query(queryStr, [userId, petId]);
    return { success: true };
  }
}
