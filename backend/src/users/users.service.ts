import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  getProfile(userId: number) {
    // Parte gustavo
  }

  updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    // Parte gustavo
  }
}
