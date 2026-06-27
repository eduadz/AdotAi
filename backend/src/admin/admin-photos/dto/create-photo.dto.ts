import { ApiProperty } from '@nestjs/swagger';

export class CreatePhotoDto {
  @ApiProperty({ description: 'URL da foto do animal', example: 'https://exemplo.com/fotos/rex01.jpg' })
  url: string;
}
