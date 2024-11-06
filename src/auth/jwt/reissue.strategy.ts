import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '~/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class JwtReIssueStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer ', '');

    const user = await this.authService.validateRefreshToken(
      payload.sub,
      refreshToken,
    );
    if (!user) {
      throw new UnauthorizedException({
        errorCode: -824,
        title: '로그인 만료',
        description:
          '로그인 시간이 지나서 다시 로그인이 필요해요.\n로그인 해 주세요. ',
      });
    }
    return user;
  }
}
