import { Controller, Post, Body, Res, UseGuards, Get, Request } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { CookieService } from './cookie.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

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

}
