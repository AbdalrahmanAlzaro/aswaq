import { JwtPayload } from '../modules/jwt-auth/jwt-auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
export {};
