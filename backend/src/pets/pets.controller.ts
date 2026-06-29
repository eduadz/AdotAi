import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { FilterPetsDto } from './dto/filter-pets.dto';

@ApiTags('Pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar animais disponíveis com filtros opcionais' })
  @ApiQuery({ name: 'id', required: false, description: 'ID do animal', example: 1 })
  @ApiQuery({ name: 'tipo', required: false, description: 'Tipo do animal', example: 'cachorro' })
  @ApiQuery({ name: 'porte', required: false, description: 'Porte do animal', example: 'pequeno' })
  @ApiQuery({ name: 'genero', required: false, description: 'Gênero do animal', example: 'femea' })
  @ApiQuery({ name: 'castrado', required: false, description: 'Se o animal é castrado', example: true })
  @ApiQuery({ name: 'cidade', required: false, description: 'Cidade do animal', example: 'Florestal' })
  @ApiQuery({ name: 'status', required: false, description: 'Status do animal', example: 'disponivel' })
  @ApiQuery({ name: 'idade', required: false, description: 'Faixa de idade', example: 'filhote' })
  @ApiQuery({ name: 'energia', required: false, description: 'Nível de energia', example: 'alta' })
  @ApiQuery({ name: 'cor_pelagem', required: false, description: 'Cor da pelagem', example: 'preto' })
  @ApiResponse({ status: 200, description: 'Lista de animais retornada com sucesso.' })
  findAll(@Query() filters: FilterPetsDto) {
    return this.petsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver detalhes de um animal específico (inclui fotos)' })
  @ApiParam({ name: 'id', description: 'ID do animal', example: 1 })
  @ApiResponse({ status: 200, description: 'Detalhes do animal retornados com sucesso.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.findOne(id);
  }
}
