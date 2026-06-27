import { Controller, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AdminAdoptionRequestsService } from './admin-adoption-requests.service';

@ApiTags('Admin - Pedidos de Adoção')
@Controller('admin')
export class AdminAdoptionRequestsController {
  constructor(private readonly adminAdoptionRequestsService: AdminAdoptionRequestsService) {}

  @Get('adoption-requests')
  @ApiOperation({ summary: 'Listar todos os pedidos de adoção' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos retornada com sucesso.' })
  findAll() {
    return this.adminAdoptionRequestsService.findAll();
  }

  @Get('pets/:id/adoption-requests')
  @ApiOperation({ summary: 'Listar pedidos de adoção de um animal específico' })
  @ApiParam({ name: 'id', description: 'ID do animal', example: 1 })
  @ApiResponse({ status: 200, description: 'Lista de pedidos do animal retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  findByPet(@Param('id', ParseIntPipe) petId: number) {
    return this.adminAdoptionRequestsService.findByPet(petId);
  }

  @Patch('adoption-requests/:id/accept')
  @ApiOperation({ summary: 'Aceitar pedido de adoção' })
  @ApiParam({ name: 'id', description: 'ID do pedido de adoção', example: 1 })
  @ApiResponse({ status: 200, description: 'Pedido aceito com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  @ApiResponse({ status: 400, description: 'Pedido não pode ser aceito (status não é pendente).' })
  accept(@Param('id', ParseIntPipe) requestId: number) {
    return this.adminAdoptionRequestsService.accept(requestId);
  }

  @Patch('adoption-requests/:id/reject')
  @ApiOperation({ summary: 'Recusar pedido de adoção' })
  @ApiParam({ name: 'id', description: 'ID do pedido de adoção', example: 1 })
  @ApiResponse({ status: 200, description: 'Pedido recusado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  @ApiResponse({ status: 400, description: 'Pedido não pode ser recusado (status não é pendente).' })
  reject(@Param('id', ParseIntPipe) requestId: number) {
    return this.adminAdoptionRequestsService.reject(requestId);
  }
}
