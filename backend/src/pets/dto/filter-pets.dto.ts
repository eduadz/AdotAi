import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterPetsDto {
  @ApiPropertyOptional({ description: 'Tipo do animal', example: 'cachorro', enum: ['cachorro', 'gato'] })
  tipo?: string;

  @ApiPropertyOptional({ description: 'Porte do animal', example: 'pequeno', enum: ['pequeno', 'medio', 'grande'] })
  porte?: string;

  @ApiPropertyOptional({ description: 'Gênero do animal', example: 'femea', enum: ['macho', 'femea'] })
  genero?: string;

  @ApiPropertyOptional({ description: 'Se o animal é castrado', example: true })
  castrado?: boolean;

  @ApiPropertyOptional({ description: 'Cidade onde o animal se encontra', example: 'Florestal' })
  cidade?: string;

  @ApiPropertyOptional({ description: 'Status do animal', example: 'disponivel', enum: ['disponivel', 'em_adocao', 'adotado'] })
  status?: string;

  @ApiPropertyOptional({ description: 'Faixa de idade do animal', example: 'filhote', enum: ['filhote', 'adulto', 'idoso'] })
  idade?: string;

  @ApiPropertyOptional({ description: 'Nível de energia do animal', example: 'alta', enum: ['baixa', 'media', 'alta'] })
  energia?: string;

  @ApiPropertyOptional({ description: 'Cor da pelagem do animal', example: 'preto' })
  cor_pelagem?: string;
}
