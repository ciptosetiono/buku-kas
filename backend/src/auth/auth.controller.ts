import { Controller, Post, Body, Res, Req, Get,  UnauthorizedException} from '@nestjs/common';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { CookieService } from './cookie.service';


@Controller('auth')
export class AuthController {
  private readonly SECRET_KEY: string;

  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {
    this.SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
  }

  @Post('signup')
  async register(
    @Body() createUserDto : CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token } = await this.authService.register(createUserDto);
    this.cookieService.setLoginCookie(response, token);
    return { user, token } ;
  }

  @Post('signin')
  async login(
    @Body() loginDto:  LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token } = await this.authService.login(loginDto);
    this.cookieService.setLoginCookie(response, token);
    return { user, token };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.clearLoginCookie(res);
    return { message: 'Logged out successfully' };
  }

  @Get('validate-token')
  validateToken(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Unauthorized: No token found');
    }

    try {
      const payload = jwt.verify(token, this.SECRET_KEY);
      // Bisa kirim user info jika perlu
      return res.status(200).json({ user: payload });
    } catch (err) {
      throw new UnauthorizedException('Unauthorized: Invalid token');
    }
  }

}
