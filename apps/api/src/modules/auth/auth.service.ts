import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '../../shared/types/enums';
import { BcryptService } from '../../shared/services/bcrypt.service';
import { JwtAuthService } from '../../shared/modules/jwt-auth/jwt-auth.service';
import { UserService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly bcrypt: BcryptService,
    private readonly jwtAuth: JwtAuthService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    if (await this.users.findByEmail(email)) {
      throw new ConflictException('Email already registered');
    }
    // IMPORTANT: await the create (Safeer Part 6 "smaller items" — they forgot to).
    const user = await this.users.create({
      email,
      name: dto.name,
      role: dto.role ?? UserRole.SHOPPER,
      passwordHash: await this.bcrypt.hash(dto.password),
    });
    return this.issue(user.id, email, user.role, user.isPremium);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findForLogin(dto.email);
    if (!user || !(await this.bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issue(user.id, user.email, user.role, user.isPremium);
  }

  private issue(sub: string, email: string, role: UserRole, isPremium: boolean) {
    // Minimal payload only — no password hash, no full user object.
    const token = this.jwtAuth.sign({ sub, email, role, isPremium });
    return { accessToken: token, user: { id: sub, email, role, isPremium } };
  }
}
