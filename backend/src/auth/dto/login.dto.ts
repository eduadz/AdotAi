import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email do usuário', example: 'joao@email.com' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senhaSegura123' })
  senha: string;
}
