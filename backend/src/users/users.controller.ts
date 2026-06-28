import { Controller, Get, Patch, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAuthGuard } from '../auth/user-auth.guard'

@ApiTags('Usuário - Perfil')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Visualizar perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  getProfile() {
    const userId = req.user.sub;
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Editar dados do perfil do usuário autenticado' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  updateProfile(@Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.sub;
    return this.usersService.updateProfile(userId, updateUserDto);
  }
}
