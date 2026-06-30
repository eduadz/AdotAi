import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePetDto {
  @ApiPropertyOptional({ description: 'Nome do animal', example: 'Rex' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({ description: 'Descrição do animal', example: 'Cachorro dócil e brincalhão' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ description: 'Tipo do animal', example: 'cachorro', enum: ['cachorro', 'gato'] })
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiPropertyOptional({ description: 'Raça do animal', example: 'SRD' })
  @IsString()
  @IsOptional()
  raca?: string;

  @ApiPropertyOptional({ description: 'Gênero do animal', example: 'macho', enum: ['macho', 'femea'] })
  @IsString()
  @IsOptional()
  genero?: string;

  @ApiPropertyOptional({ description: 'Porte do animal', example: 'medio', enum: ['pequeno', 'medio', 'grande'] })
  @IsString()
  @IsOptional()
  porte?: string;

  @ApiPropertyOptional({ description: 'Cor da pelagem', example: 'caramelo' })
  @IsString()
  @IsOptional()
  cor_pelagem?: string;

  @ApiPropertyOptional({ description: 'Tipo da pelagem', example: 'curta' })
  @IsString()
  @IsOptional()
  tipo_pelagem?: string;

  @ApiPropertyOptional({ description: 'Faixa de idade', example: 'adulto', enum: ['filhote', 'adulto', 'idoso'] })
  @IsString()
  @IsOptional()
  idade?: string;

  @ApiPropertyOptional({ description: 'Nível de energia', example: 'alta', enum: ['baixa', 'media', 'alta'] })
  @IsString()
  @IsOptional()
  energia?: string;

  @ApiPropertyOptional({ description: 'Comorbidades do animal', example: false })
  @IsBoolean()
  @IsOptional()
  comorbidade?: boolean;

  @ApiPropertyOptional({ description: 'Se o animal é castrado', example: false })
  @IsBoolean()
  @IsOptional()
  castrado?: boolean;
}
