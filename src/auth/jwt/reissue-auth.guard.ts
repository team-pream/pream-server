import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ReissueAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid refresh token');
    }
    return user;
  }
}
