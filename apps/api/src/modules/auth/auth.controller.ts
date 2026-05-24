import { Body, Get, NotFoundException, Post } from '@nestjs/common';
import { GenericController } from '../../shared/decorators/generic-controller.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import { CurrentUser, type AuthUser } from '../../shared/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@GenericController('auth', true)
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UserService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  // Echoes the JWT-derived identity, refreshed from the DB so isPremium / role reflect any
  // recent admin changes since the token was issued.
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const u = await this.users.findById(user.sub);
    if (!u) throw new NotFoundException('User not found');
    return { id: u.id, email: u.email, name: u.name, role: u.role, isPremium: u.isPremium };
  }
}
