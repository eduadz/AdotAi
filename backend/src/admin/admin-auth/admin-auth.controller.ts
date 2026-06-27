import { Controller, Post, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('auth/login')
  @ApiTags('Admin - Autenticação')
  @ApiOperation({ summary: 'Login do administrador' })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso. Retorna token JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminAuthService.login(adminLoginDto);
  }

  @Get('me')
  @ApiTags('Admin - Perfil')
  @ApiOperation({ summary: 'Visualizar perfil do administrador autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  getProfile() {
    // Parte gustavo — obter adminId do token JWT
    const adminId = 0;
    return this.adminAuthService.getProfile(adminId);
  }

  @Patch('me')
  @ApiTags('Admin - Perfil')
  @ApiOperation({ summary: 'Editar dados do perfil do administrador' })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  updateProfile(@Body() updateAdminDto: UpdateAdminDto) {
    // Parte gustavo — obter adminId do token JWT
    const adminId = 0;
    return this.adminAuthService.updateProfile(adminId, updateAdminDto);
  }
}
