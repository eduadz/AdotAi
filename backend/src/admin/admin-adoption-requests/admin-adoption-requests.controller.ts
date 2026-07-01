import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAdoptionRequestsService } from './admin-adoption-requests.service';
import { AdminGuard } from '../admin-auth/admin.guard';

@ApiTags('Admin - Pedidos de Adoção')
@UseGuards(AdminGuard)
@ApiBearerAuth()
@Controller('admin/adoption-requests')
export class AdminAdoptionRequestsController {
  constructor(private readonly adminAdoptionRequestsService: AdminAdoptionRequestsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os pedidos de adoção efetuados no sistema' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos de adoção.' })
  findAll() {
    return this.adminAdoptionRequestsService.findAll();
  }

  @Get('pets/:id')
  @ApiOperation({ summary: 'Listar pedidos de adoção específicos de um animal' })
  @ApiParam({ name: 'id', description: 'ID do animal', example: 1 })
  @ApiResponse({ status: 200, description: 'Lista de pedidos para o animal.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  findByPet(@Param('id', ParseIntPipe) petId: number) {
    return this.adminAdoptionRequestsService.findByPet(petId);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Aceitar um pedido de adoção pendente' })
  @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
  @ApiResponse({ status: 200, description: 'Pedido aceito com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  @ApiResponse({ status: 400, description: 'Pedido não pode ser aceito.' })
  accept(@Param('id', ParseIntPipe) requestId: number) {
    return this.adminAdoptionRequestsService.accept(requestId);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Recusar um pedido de adoção pendente' })
  @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
  @ApiResponse({ status: 200, description: 'Pedido recusado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  @ApiResponse({ status: 400, description: 'Pedido não pode ser recusado.' })
  reject(@Param('id', ParseIntPipe) requestId: number) {
    return this.adminAdoptionRequestsService.reject(requestId);
  }
}