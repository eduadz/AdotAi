import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEnderecoDto {
  @ApiPropertyOptional({ description: 'Cidade do endereço', example: 'Florestal' })
  @IsString()
  @IsOptional()
  cidade?: string;

  @ApiPropertyOptional({ description: 'Logradouro do endereço', example: 'Rua das Flores' })
  @IsString()
  @IsOptional()
  logradouro?: string;

  @ApiPropertyOptional({ description: 'Bairro do endereço', example: 'Centro' })
  @IsString()
  @IsOptional()
  bairro?: string;

  @ApiPropertyOptional({ description: 'Número do endereço', example: '123' })
  @IsString()
  @IsOptional()
  numero?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nome completo do usuário', example: 'João Silva' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({ description: 'CPF do usuário', example: '11122233344' }) 
  @IsString()
  @IsOptional()
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 dígitos' })
  cpf?: string;

  @ApiPropertyOptional({ description: 'Telefone do usuário', example: '31999998888' })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiPropertyOptional({ description: 'Email do usuário', example: 'joao@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  // 3. Adicione a propriedade composta 'endereco' com validação aninhada
  @ApiPropertyOptional({ type: () => UpdateEnderecoDto, description: 'Endereço composto do usuário' })
  @ValidateNested()          
  @Type(() => UpdateEnderecoDto)
  @IsOptional()
  endereco?: UpdateEnderecoDto;
}