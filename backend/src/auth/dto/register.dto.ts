import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Length, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Nome completo do usuário', example: 'João Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiProperty({ description: 'CPF do usuário (somente números)', example: '12345678901', maxLength: 11 })
  @IsString()
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 dígitos' })
  cpf: string;

  @ApiProperty({ description: 'Telefone do usuário', example: '31999998888', maxLength: 15 })
  @IsString()
  telefone: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@email.com' })
  @IsEmail({}, { message: 'Forneça um endereço de email válido' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senhaSegura123' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  senha: string;

  @ApiPropertyOptional({ description: 'Cidade do endereço', example: 'Florestal', default: 'FLORESTAL' })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiPropertyOptional({ description: 'Logradouro do endereço', example: 'Rua das Flores' })
  @IsOptional()
  @IsString()
  logradouro?: string;

  @ApiPropertyOptional({ description: 'Bairro do endereço', example: 'Centro' })
  @IsOptional()
  @IsString()
  bairro?: string;

  @ApiPropertyOptional({ description: 'Número do endereço', example: '123' })
  @IsOptional()
  @IsString()
  numero?: string;
}
