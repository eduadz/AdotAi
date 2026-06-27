import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdoptionRequestDto {
  @ApiPropertyOptional({ description: 'Mensagem opcional do usuário ao solicitar adoção', example: 'Gostaria muito de adotar este animal!' })
  mensagem?: string;
}
