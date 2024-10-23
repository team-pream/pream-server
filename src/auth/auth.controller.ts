import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Res,
  Response,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '~/auth/auth.service';
import { ReissueAuthGuard } from '~/auth/jwt/reissue-auth.guard';
import { KakaoAuthGuard } from '~/auth/kakao/kakao-auth.guard';
import { KakaoUserData } from '~/auth/decorator/kakao-user.decorator';
import { KakaoUserDataDTO } from '~/auth/dto/kakao-user.dto';
import { Response as ExpressResponse } from 'express';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtRequest } from './dto/jwt-payload.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '카카오 로그인 리디렉션 API' })
  @ApiResponse({
    status: 200,
    description: '카카오 로그인 창으로 리디렉션',
  })
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {}

  @ApiOperation({
    summary: '카카오 로그인 콜백 처리 API',
    description:
      '로그인 성공 시 클라이언트를 http://localhost:3000/auth/kakao로 리다이렉트합니다.<br/>발급된 accessToken과 refreshToken, 온보딩 필요 여부(needOnboarding)는 쿼리 파라미터로 전달됩니다.',
  })
  @ApiResponse({
    status: 302,
    headers: {
      Location: {
        description: '카카오 로그인 후 클라이언트로 리다이렉트',
        schema: {
          type: 'string',
          example:
            'http://localhost:3000/auth/kakao?access={accessToken}&refresh={refreshToken}&needOnboarding={true|false}',
        },
      },
    },
  })
  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(
    @KakaoUserData() userData: KakaoUserDataDTO,
    @Res() res: ExpressResponse,
  ) {
    const { id, username } = userData;

    const { accessToken, refreshToken, needOnboarding } =
      await this.authService.login({
        id: id.toString(),
        username,
      });

    res.redirect(
      `http://localhost:3000/auth/kakao?access=${accessToken}&refresh=${refreshToken}&needOnboarding=${needOnboarding}`,
    );
  }

  @ApiOperation({
    summary: '로그인 상태 확인 API',
    description:
      'Access token의 유효성을 검증하여 로그인 상태를 확인할 수 있는 API입니다.<br/>프론트엔드단에서는 Access token의 유효성을 별도로 검증하지 않아도 됩니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
  })
  @ApiResponse({
    status: 200,
    description: '유효한 사용자 - Access token이 아직 만료되지 않음',
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 사용자 - Access token이 유효하지 않거나 만료됨',
    content: {
      'application/json': {
        example: {
          errorCode: -825,
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getStatus(@Request() req: any, @Response() res: ExpressResponse) {
    const { user } = req;

    if (user) {
      return res.sendStatus(200);
    }

    return res.send({ errorCode: -825 });
  }

  @ApiOperation({
    summary: 'Access 토큰 재발급 API',
    description:
      'Access token 만료 시 Refresh token을 이용하여 새로운 Access token을 발급합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Refresh token}',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
    content: {
      'application/json': {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않거나 만료된 토큰',
    content: {
      'application/json': {
        example: {
          errorCode: -824,
        },
      },
    },
  })
  @UseGuards(ReissueAuthGuard)
  @Post('reissue')
  async reIssueAccessToken(@Request() req: JwtRequest) {
    return this.authService.reIssueToken(req.user.refreshToken);
  }
}
