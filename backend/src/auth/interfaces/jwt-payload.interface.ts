export interface JwtPayload {
    email: string;
    sub: string; // userId
    role: string;
  }