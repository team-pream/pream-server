import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtRequest } from '~/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from '~/auth/jwt/jwt-auth.guard';
import { UserResponseDto } from '~/user/dto/user-response.dto';
import { UserService } from '~/user/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: '사용자 프로필 조회',
    description:
      '사용자 프로필과 반려동물 프로필을 조회합니다.<br/>반려동물 정보는 배열로 주어지지만, 대표 반려동물 정보 하나만 조회됩니다.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: [UserResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserProfile(@Request() req: JwtRequest) {
    return this.userService.getUserProfile(req.user.id);
  }
}
