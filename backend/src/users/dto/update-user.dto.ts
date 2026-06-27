import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nome completo do usuário', example: 'João Silva' })
  nome?: string;

  @ApiPropertyOptional({ description: 'Telefone do usuário', example: '31999998888' })
  telefone?: string;

  @ApiPropertyOptional({ description: 'Email do usuário', example: 'joao@email.com' })
  email?: string;

  @ApiPropertyOptional({ description: 'Cidade do endereço', example: 'Florestal' })
  cidade?: string;

  @ApiPropertyOptional({ description: 'Logradouro do endereço', example: 'Rua das Flores' })
  logradouro?: string;

  @ApiPropertyOptional({ description: 'Bairro do endereço', example: 'Centro' })
  bairro?: string;

  @ApiPropertyOptional({ description: 'Número do endereço', example: '123' })
  numero?: string;
}
