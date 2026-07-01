import { Controller, Post, Get, Patch, Param, Body, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AdoptionRequestsService } from './adoption-requests.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Pedidos de Adoção')
@UseGuards(AuthGuard)
@Controller()
export class AdoptionRequestsController {
  constructor(private readonly adoptionRequestsService: AdoptionRequestsService) { }

  @Post('pets/:id/adoption-requests')
  @ApiOperation({ summary: 'Solicitar adoção de um animal' })
  @ApiParam({ name: 'id', description: 'ID do animal', example: 1 })
  @ApiBody({ type: CreateAdoptionRequestDto })
  @ApiResponse({ status: 201, description: 'Pedido de adoção criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Já existe um pedido de adoção deste usuário para este animal.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  create(@Request() req,
    @Param('id', ParseIntPipe) petId: number,
    @Body() dto: CreateAdoptionRequestDto,
  ) {
    // Parte gustavo — obter userId do token JWT
    const userId = req.user.sub;
    return this.adoptionRequestsService.create(userId, petId, dto);
  }

  @Get('users/me/adoption-requests')
  @ApiOperation({ summary: 'Ver pedidos de adoção do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos de adoção retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  findByUser(@Request() req) {
    // Parte gustavo — obter userId do token JWT
    const userId = req.user.sub;
    return this.adoptionRequestsService.findByUser(userId);
  }

  @Patch('adoption-requests/:id/cancel')
  @ApiOperation({ summary: 'Cancelar pedido de adoção' })
  @ApiParam({ name: 'id', description: 'ID do pedido de adoção', example: 1 })
  @ApiResponse({ status: 200, description: 'Pedido cancelado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pedido de adoção não encontrado.' })
  @ApiResponse({ status: 400, description: 'Pedido não pode ser cancelado (status não é pendente).' })
  cancel(@Request() req, @Param('id', ParseIntPipe) requestId: number) {
    // Parte gustavo — obter userId do token JWT
    const userId = req.user.sub;
    return this.adoptionRequestsService.cancel(userId, requestId);
  }
}