import { Request } from 'express';

export interface JwtPayload {
  id?: string;
  refreshToken?: string;
}

export interface JwtRequest extends Request {
  user: JwtPayload;
}
