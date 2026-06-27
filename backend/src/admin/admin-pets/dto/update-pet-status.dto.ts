import { ApiProperty } from '@nestjs/swagger';

export class UpdatePetStatusDto {
  @ApiProperty({
    description: 'Novo status do animal',
    example: 'disponivel',
    enum: ['disponivel', 'em_adocao', 'adotado'],
  })
  status: string;
}
