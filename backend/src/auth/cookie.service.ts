// src/auth/cookie.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

const max_age = 1000 * 60 * 60 * 24; // 1 day    

const isProduction: boolean = process.env.NODE_ENV === 'production';

const domainOrigin = isProduction ? '.stik.co.id' : 'localhost';

const private_cookie_options = {
  domain:domainOrigin,
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ('none' as 'none') : ('lax' as 'lax'), // cross-origin in prod, simple in dev
  maxAge: max_age, // e.g., 24 * 60 * 60 * 1000
}

const public_cookie_options = {
  domain: domainOrigin, 
  httpOnly: false, // ✅ bisa dibaca oleh middleware frontend
  secure: isProduction,
  sameSite: isProduction ? ('none' as 'none') : ('lax' as 'lax'), 
  maxAge: max_age,
}


@Injectable()
export class CookieService {
  setLoginCookie(res: Response, token: string) {
    const isProduction: boolean = process.env.NODE_ENV === 'production';

    res.cookie('access_token', token, private_cookie_options);

    const public_token = Math.random().toString(36).substring(2);
    res.cookie('public_token', public_token, public_cookie_options);

  }

  clearLoginCookie(res: Response) {

    res.clearCookie('access_token', private_cookie_options);

      res.clearCookie('public_token', public_cookie_options);
  }
}
