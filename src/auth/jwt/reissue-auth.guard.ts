import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ERROR_RESPONSE } from '~/errors/error';

@Injectable()
export class ReissueAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw (
        err || new UnauthorizedException(ERROR_RESPONSE.INVALID_REFRESH_TOKEN)
      );
    }
    return user;
  }
}
