import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Nome completo do usuário', example: 'João Silva' })
  nome: string;

  @ApiProperty({ description: 'CPF do usuário (somente números)', example: '12345678901', maxLength: 11 })
  cpf: string;

  @ApiProperty({ description: 'Telefone do usuário', example: '31999998888', maxLength: 15 })
  telefone: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@email.com' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senhaSegura123' })
  senha: string;

  @ApiPropertyOptional({ description: 'Cidade do endereço', example: 'Florestal', default: 'FLORESTAL' })
  cidade?: string;

  @ApiPropertyOptional({ description: 'Logradouro do endereço', example: 'Rua das Flores' })
  logradouro?: string;

  @ApiPropertyOptional({ description: 'Bairro do endereço', example: 'Centro' })
  bairro?: string;

  @ApiPropertyOptional({ description: 'Número do endereço', example: '123' })
  numero?: string;
}
