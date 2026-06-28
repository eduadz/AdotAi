import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException, // Importamos este erro para "Acesso Negado"
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Pulseira VIP (Token) não encontrada!');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'chave-secreta-super-segura',
      });
      
      // Bloqueia a requisição na hora se não for um Admin
      if (payload.role !== 'administrador') {
        throw new ForbiddenException('Acesso negado! Apenas administradores podem realizar esta ação.');
      }

      request['user'] = payload;
    } catch (error) {
      // Se o erro foi lançado por nós mesmos (Forbidden), apenas repassamos
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Token inválido ou expirado!');
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}