import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterPetsDto {
  @ApiPropertyOptional({ description: 'Tipo do animal', example: 'cachorro', enum: ['cachorro', 'gato'] })
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiPropertyOptional({ description: 'Porte do animal', example: 'pequeno', enum: ['pequeno', 'medio', 'grande'] })
  @IsString()
  @IsOptional()
  porte?: string;

  @ApiPropertyOptional({ description: 'Gênero do animal', example: 'femea', enum: ['macho', 'femea'] })
  @IsString()
  @IsOptional()
  genero?: string;

  @ApiPropertyOptional({ description: 'Se o animal é castrado', example: true })
  @IsOptional()
  castrado?: boolean;

  @ApiPropertyOptional({ description: 'Cidade onde o animal se encontra', example: 'Florestal' })
  @IsString()
  @IsOptional()
  cidade?: string;

  @ApiPropertyOptional({ description: 'Status do animal', example: 'disponivel', enum: ['disponivel', 'em_adocao', 'adotado'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Faixa de idade do animal', example: 'filhote', enum: ['filhote', 'adulto', 'idoso'] })
  @IsString()
  @IsOptional()
  idade?: string;

  @ApiPropertyOptional({ description: 'Nível de energia do animal', example: 'alta', enum: ['baixa', 'media', 'alta'] })
  @IsString()
  @IsOptional()
  energia?: string;

  @ApiPropertyOptional({ description: 'Cor da pelagem do animal', example: 'preto' })
  @IsString()
  @IsOptional()
  cor_pelagem?: string;
}
