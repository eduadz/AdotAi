import { 
  Controller, Post, Patch, Delete, Param, Body, ParseIntPipe, Request, UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AdminPetsService } from './admin-pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { UpdatePetStatusDto } from './dto/update-pet-status.dto';
import { AdminGuard } from '../admin-auth/admin.guard'; 

@ApiTags('Admin - Pets')
@UseGuards(AdminGuard)
@ApiBearerAuth() 
@Controller('admin/pets')
export class AdminPetsController {
  constructor(private readonly adminPetsService: AdminPetsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo animal' })
  @ApiBody({ type: CreatePetDto })
  @ApiResponse({ status: 201, description: 'Animal cadastrado com sucesso.' })
  create(@Request() req, @Body() dto: CreatePetDto) { 
    const adminId = req.user.sub;//
    return this.adminPetsService.create(adminId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar dados de um animal' })
  @ApiParam({ name: 'id', description: 'ID do animal', example: 1 })
  @ApiBody({ type: UpdatePetDto })
  @ApiResponse({ status: 200, description: 'Animal atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePetDto,
  ) {
    return this.adminPetsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um animal' })
  @ApiParam({ name: 'id', description: 'ID do animal', example: 1 })
  @ApiResponse({ status: 200, description: 'Animal removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminPetsService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Alterar status de um animal' })
  @ApiParam({ name: 'id', description: 'ID do animal', example: 1 })
  @ApiBody({ type: UpdatePetStatusDto })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePetStatusDto,
  ) {
    return this.adminPetsService.updateStatus(id, dto);
  }
}