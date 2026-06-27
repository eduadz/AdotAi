import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ description: 'Email do administrador', example: 'admin@adotai.com' })
  email: string;

  @ApiProperty({ description: 'Senha do administrador', example: 'adminSeguro123' })
  senha: string;
}
