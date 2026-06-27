import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiPropertyOptional({ description: 'Nome do administrador', example: 'Admin Silva' })
  nome?: string;

  @ApiPropertyOptional({ description: 'Email do administrador', example: 'admin@adotai.com' })
  email?: string;
}
