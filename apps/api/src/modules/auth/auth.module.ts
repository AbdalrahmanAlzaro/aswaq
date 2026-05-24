import { Module } from '@nestjs/common';
import { JwtAuthModule } from '../../shared/modules/jwt-auth/jwt-auth.module';
import { BcryptService } from '../../shared/services/bcrypt.service';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService, BcryptService],
})
export class AuthModule {}
