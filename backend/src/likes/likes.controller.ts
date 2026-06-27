import { Controller, Post, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LikesService } from './likes.service';

@ApiTags('Likes')
@Controller()
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('pets/:id/like')
  @ApiOperation({ summary: 'Curtir um animal' })
  @ApiParam({ name: 'id', description: 'ID do animal', example: 1 })
  @ApiResponse({ status: 201, description: 'Animal curtido com sucesso.' })
  @ApiResponse({ status: 409, description: 'Usuário já curtiu este animal.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  like(@Param('id', ParseIntPipe) petId: number) {
    // Parte gustavo — obter userId do token JWT
    const userId = 0;
    return this.likesService.like(userId, petId);
  }

  @Delete('pets/:id/like')
  @ApiOperation({ summary: 'Remover curtida de um animal' })
  @ApiParam({ name: 'id', description: 'ID do animal', example: 1 })
  @ApiResponse({ status: 200, description: 'Curtida removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Like não encontrado.' })
  unlike(@Param('id', ParseIntPipe) petId: number) {
    // Parte gustavo — obter userId do token JWT
    const userId = 0;
    return this.likesService.unlike(userId, petId);
  }

  @Get('users/me/likes')
  @ApiOperation({ summary: 'Ver animais curtidos pelo usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de animais curtidos retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  getUserLikes() {
    // Parte gustavo — obter userId do token JWT
    const userId = 0;
    return this.likesService.getUserLikes(userId);
  }

  @Get('pets/:id/likes')
  @ApiOperation({ summary: 'Ver quantidade de likes de um animal' })
  @ApiParam({ name: 'id', description: 'ID do animal', example: 1 })
  @ApiResponse({ status: 200, description: 'Contagem de likes retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  getPetLikesCount(@Param('id', ParseIntPipe) petId: number) {
    return this.likesService.getPetLikesCount(petId);
  }
}
