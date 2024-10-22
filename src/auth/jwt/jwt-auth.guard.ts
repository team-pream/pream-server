import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [, token] = authHeader.split(' ');
    return token;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('인증 헤더가 없습니다.');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = { id: decoded.sub };
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        error,
        '유효하지 않거나 만료된 토큰입니다.',
      );
    }
  }
}
