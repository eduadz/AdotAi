import { Injectable } from '@nestjs/common';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminAuthService {
  login(adminLoginDto: AdminLoginDto) {
    // Parte gustavo
  }

  getProfile(adminId: number) {
    // Parte gustavo
  }

  updateProfile(adminId: number, updateAdminDto: UpdateAdminDto) {
    // Parte gustavo
  }
}
