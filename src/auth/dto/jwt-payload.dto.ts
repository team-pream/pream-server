import { Request } from 'express';

export interface JwtPayload {
  id?: string;
  refreshToken?: string;
  nickname?: string;
}

export interface JwtRequest extends Request {
  user: JwtPayload;
}
