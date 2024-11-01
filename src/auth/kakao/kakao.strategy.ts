import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { AuthService } from '~/auth/auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { id, username, displayName } = profile;

      const user = {
        providerId: id.toString(),
        username: username ?? displayName,
      };

      const validatedUser = await this.authService.validateKakaoUser(user);
      return done(null, validatedUser);
    } catch (error) {
      done(error, false);
    }
  }
}
