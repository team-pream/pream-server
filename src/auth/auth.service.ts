import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(user: any) {
    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    return { accessToken };
  }

  async generateRefreshToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { refreshToken };
  }

  async login(user: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    const needOnboarding =
      !existingUser.nickname || !existingUser.phone || !existingUser.email;

    const accessTokenInfo = await this.generateAccessToken(user);
    const refreshTokenInfo = await this.generateRefreshToken(user);
    return {
      ...accessTokenInfo,
      ...refreshTokenInfo,
      needOnboarding,
    };
  }

  async reIssueToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('유효하지 않거나 만료된 토큰');
      }

      const newAccessToken = await this.generateAccessToken(user);
      return { ...newAccessToken };
    } catch (error: unknown) {
      throw new UnauthorizedException(`${error} 유효하지 않거나 만료된 토큰`);
    }
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return user;
  }

  async validateKakaoUser(kakaoProfile: {
    providerId: string;
    username: string;
  }) {
    const { providerId, username } = kakaoProfile;

    let user = await this.prisma.user.findUnique({
      where: { providerId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          username,
          provider: 'KAKAO',
          providerId,
        },
      });
    }

    return user;
  }
}
