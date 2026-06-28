import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { AdminAuthController } from './admin-auth/admin-auth.controller';
import { AdminAuthService } from './admin-auth/admin-auth.service';
import { AdminPetsController } from './admin-pets/admin-pets.controller';
import { AdminPetsService } from './admin-pets/admin-pets.service';
import { AdminPhotosController } from './admin-photos/admin-photos.controller';
import { AdminPhotosService } from './admin-photos/admin-photos.service';
import { AdminAdoptionRequestsController } from './admin-adoption-requests/admin-adoption-requests.controller';
import { AdminAdoptionRequestsService } from './admin-adoption-requests/admin-adoption-requests.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'chave-secreta-super-segura',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AdminAuthController,
    AdminPetsController,
    AdminPhotosController,
    AdminAdoptionRequestsController,
  ],
  providers: [
    AdminAuthService,
    AdminPetsService,
    AdminPhotosService,
    AdminAdoptionRequestsService,
  ],
})
export class AdminModule {}