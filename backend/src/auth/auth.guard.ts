import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
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
      
      // O payload agora contém { sub, email, role }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado!');
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}