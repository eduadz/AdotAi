import { Controller, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AdminPhotosService } from './admin-photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

@ApiTags('Admin - Fotos')
@Controller('admin/pets/:petId/photos')
export class AdminPhotosController {
  constructor(private readonly adminPhotosService: AdminPhotosService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar foto a um animal' })
  @ApiParam({ name: 'petId', description: 'ID do animal', example: 1 })
  @ApiBody({ type: CreatePhotoDto })
  @ApiResponse({ status: 201, description: 'Foto adicionada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  addPhoto(
    @Param('petId', ParseIntPipe) petId: number,
    @Body() dto: CreatePhotoDto,
  ) {
    return this.adminPhotosService.addPhoto(petId, dto);
  }

  @Delete(':photoId')
  @ApiOperation({ summary: 'Remover foto de um animal' })
  @ApiParam({ name: 'petId', description: 'ID do animal', example: 1 })
  @ApiParam({ name: 'photoId', description: 'ID da foto', example: 1 })
  @ApiResponse({ status: 200, description: 'Foto removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Foto ou animal não encontrado.' })
  removePhoto(
    @Param('petId', ParseIntPipe) petId: number,
    @Param('photoId', ParseIntPipe) photoId: number,
  ) {
    return this.adminPhotosService.removePhoto(petId, photoId);
  }
}
