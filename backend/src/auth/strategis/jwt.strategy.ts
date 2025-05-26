// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';


function jwtExtractor(req: Request): string | null {
  if (!req) return null;

  const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (tokenFromHeader) return tokenFromHeader;

  if (req.cookies && req.cookies['access_token']) {
    return req.cookies['access_token'];
  }

  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: jwtExtractor,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {

    const user = await this.authService.validateUser(payload.email, null);
    if (!user) {
      throw new UnauthorizedException('Invalid Authorization Token');
    }

    // Only return safe, non-sensitive fields to be used in request.user
    return {
      userId: user._id,
      email: user.email,
      role: user.role,
    };
  }
}
