import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtRequest } from '~/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from '~/auth/jwt/jwt-auth.guard';
import { UsersService } from './users.service';
import { GetProfileResponseDto } from './dto/profile.dto';
import { PatchMeResponseDto } from './dto/me.dto';

@ApiTags('Users')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {Access token}',
})
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: '사용자 & 반려동물 프로필 조회',
    description: '사용자 프로필과 반려동물 프로필을 <b>함께</b> 조회합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 조회 성공',
    type: GetProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 사용자',
    example: { errorCode: -836 },
  })
  @Get('profile')
  async getUser(@Request() req: JwtRequest) {
    return this.usersService.getUsersProfile(req.user.id);
  }

  @ApiOperation({
    summary: '사용자 프로필 수정',
    description:
      '사용자 프로필의 닉네임, 휴대폰번호, 판매정산계죄를 수정합니다.<br/>수정하려는 항목만 선택적으로 전달할 수 있습니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Access token}',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 수정 성공',
    type: PatchMeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Access 토큰이 유효하지 않거나 만료된 사용자',
    example: { errorCode: -825 },
  })
  @Patch('me')
  async updateUser(
    @Body()
    updateData: {
      nickname?: string;
      phone?: string;
      bankAccount?: { bank: string; accountNumber: string };
    },
    @Request() req?: any,
  ) {
    const userId = req.user?.id;
    return this.usersService.patchUsersMe(userId, updateData);
  }
}
