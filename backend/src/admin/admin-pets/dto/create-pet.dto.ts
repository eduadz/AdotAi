import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePetDto {
  @ApiProperty({ description: 'Nome do animal', example: 'Rex' })
  nome: string;

  @ApiPropertyOptional({ description: 'Descrição do animal', example: 'Cachorro dócil e brincalhão' })
  descricao?: string;

  @ApiPropertyOptional({ description: 'Tipo do animal', example: 'cachorro', enum: ['cachorro', 'gato'] })
  tipo?: string;

  @ApiPropertyOptional({ description: 'Gênero do animal', example: 'macho', enum: ['macho', 'femea'] })
  genero?: string;

  @ApiPropertyOptional({ description: 'Porte do animal', example: 'medio', enum: ['pequeno', 'medio', 'grande'] })
  porte?: string;

  @ApiPropertyOptional({ description: 'Cor da pelagem', example: 'caramelo' })
  cor_pelagem?: string;

  @ApiPropertyOptional({ description: 'Tipo da pelagem', example: 'curta' })
  tipo_pelagem?: string;

  @ApiPropertyOptional({ description: 'Faixa de idade', example: 'adulto', enum: ['filhote', 'adulto', 'idoso'] })
  idade?: string;

  @ApiPropertyOptional({ description: 'Nível de energia', example: 'alta', enum: ['baixa', 'media', 'alta'] })
  energia?: string;

  @ApiPropertyOptional({ description: 'Comorbidades do animal', example: 'Nenhuma' })
  comorbidade?: string;

  @ApiPropertyOptional({ description: 'Se o animal é castrado', example: false, default: false })
  castrado?: boolean;
}
