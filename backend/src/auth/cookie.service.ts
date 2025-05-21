// src/auth/cookie.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

const MAX_AGE = 1000 * 60 * 60 * 24; // 1 day    

@Injectable()
export class CookieService {
  setLoginCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE, // 1 day
    });
  }

  clearLoginCookie(res: Response) {
    res.clearCookie('access_token');
  }
}
