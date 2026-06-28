import { Controller, Post, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminAuthGuard } from './admin-auth.guard'; // Certifique-se de importar o Guard

@ApiTags('Admin - Autenticação e Perfil')
@Controller('admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('auth/login')
  @ApiOperation({ summary: 'Login do administrador' })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso. Retorna token JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminAuthService.login(adminLoginDto);
  }

  // O UseGuards exige o token. Se não tiver, ele barra antes de chegar aqui.
  @UseGuards(AdminAuthGuard) 
  @ApiBearerAuth() // Avisa o Swagger que precisa do token
  @Get('me')
  @ApiOperation({ summary: 'Visualizar perfil do administrador autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  getProfile(@Request() req) {
    const adminId = req.admin.sub; 
    return this.adminAuthService.getProfile(adminId);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Patch('me')
  @ApiOperation({ summary: 'Editar dados do perfil do administrador' })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autenticado.' })
  updateProfile(@Request() req, @Body() updateAdminDto: UpdateAdminDto) {
    const adminId = req.admin.sub;
    return this.adminAuthService.updateProfile(adminId, updateAdminDto);
  }
}