import { Module } from '@nestjs/common';
import { AuthService } from '~/auth/auth.service';
import { AuthController } from '~/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '~/auth/jwt/jwt.strategy';
import { JwtReIssueStrategy } from '~/auth/jwt/reissue.strategy';
import { ReIssueAuthGuard } from '~/auth/jwt/reissue-auth.guard';
import { KakaoStrategy } from '~/auth/kakao/kakao.strategy';
import { KakaoAuthGuard } from '~/auth/kakao/kakao-auth.guard';
import { PrismaService } from '~/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    JwtReIssueStrategy,
    ReIssueAuthGuard,
    KakaoStrategy,
    KakaoAuthGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
