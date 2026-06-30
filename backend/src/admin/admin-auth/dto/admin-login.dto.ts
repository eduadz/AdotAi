import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength} from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ description: 'Email do administrador', example: 'admin@adotai.com' })
  @IsEmail({}, { message: 'Forneça um endereço de email válido' })
  email: string;

  @ApiProperty({ description: 'Senha do administrador', example: 'adminSeguro123' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  senha: string;
}
